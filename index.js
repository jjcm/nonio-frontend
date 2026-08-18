import config from './config.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

var http = require('http')
var fs = require('fs')
var path = require('path')
var pug = require('pug')
var url = require('url')
var mime = require('mime-types')
var prerender = require('prerender-node')
var zlib = require('zlib')
var esbuild = require('esbuild')

// Bundle the critical module graphs at boot so first paint isn't gated by
// ~30 serial HTTP/1.1 module requests. Dynamic imports (deferred components)
// stay split into their own chunks. Rebuilt on every server start.
var DIST = '.speed-lab-dist'
try {
  fs.rmSync(DIST, { recursive: true, force: true })
  esbuild.buildSync({
    entryPoints: ['soci.js', 'components/soci-components.js'],
    bundle: true,
    minify: true,
    format: 'esm',
    splitting: true,
    outdir: DIST,
    outbase: '.',
    logLevel: 'error'
  })
  console.log('critical JS graph bundled into ' + DIST)
}
catch(e) {
  console.log('bundle failed, serving unbundled modules: ' + e.message)
}

// Serve bundled artifacts (and their chunks) when present.
var resolveFile = function(reqPath){
  if(fs.existsSync('./' + DIST + reqPath)) return './' + DIST + reqPath
  if(fs.existsSync('.' + reqPath)) return '.' + reqPath
  return null
}

// Shared chunks are only discoverable once the entry bundles parse, costing a
// serial RTT wave; preload just those (not the deferred route chunk).
var chunkPreloads = ''
try {
  chunkPreloads = fs.readdirSync(DIST)
    .filter(f => f.startsWith('chunk-') && f.endsWith('.js'))
    .map(f => `<link rel="modulepreload" href="/${f}">`)
    .join('')
}
catch(e) {}

// Compile the shell template once; renderFile re-parses index.pug and all
// includes on every request (~30ms of TTFB).
var shellTemplate = pug.compileFile('index.pug')
var shellHtml = function(){
  var html = shellTemplate()
  if(chunkPreloads) html = html.replace('<script', chunkPreloads + '<script')
  return html
}

// gzip text-ish responses when the client supports it; static files pass a
// cacheKey (path+ETag) so their gzipped bytes are computed once, not per request
var compressible = /html|javascript|json|css|svg|xml|wasm|text/
var gzipCache = new Map()
var send = function(req, res, status, headers, body, cacheKey){
  var accepts = (req.headers['accept-encoding'] || '').includes('gzip')
  if(accepts && body && compressible.test(headers['Content-Type'] || '')){
    var zipped = cacheKey && gzipCache.get(cacheKey)
    if(!zipped){
      zipped = zlib.gzipSync(body)
      if(cacheKey) gzipCache.set(cacheKey, zipped)
    }
    body = zipped
    headers['Content-Encoding'] = 'gzip'
    headers['Vary'] = 'Accept-Encoding'
  }
  res.writeHead(status, headers)
  res.end(body)
}


var server = http.createServer(function (req, res) {

  var sociServer = async () => {
      var ext = path.extname(req.url)
      // Feed shell: embed the anonymous /posts payload this route needs so
      // first render doesn't wait on an API roundtrip after JS boot.
      // Path-keyed; the client falls back to a live fetch on any mismatch.
      if(req.url == '/'){
        console.log(req.method + ' | ' + 'FEED   | /')
        let html = shellHtml()
        try {
          let posts = await fetch(config.API_HOST + '/posts').then(r => r.ok ? r.text() : null)
          if(posts){
            html = html.replace('<script', `<script>window.__sociPreload={"/posts":${posts.replace(/</g, '\\u003c')}}</script><script`)
            // Preload only the LCP image: the first rendered post's thumbnail.
            // (Deliberately not the whole grid - measured slower in prior labs.)
            let lcp = JSON.parse(posts).posts?.find(p => p.type == 'image' || p.type == 'link')
            if(lcp) html = html.replace('<script', `<link rel="preload" as="image" href="${config.THUMBNAIL_HOST}/${lcp.url}.webp"><script`)
          }
        }
        catch {}
        send(req, res, 200, { 'Content-Type': 'text/html' }, html)
        return
      }
      if(resolveFile(req.url)) {
        switch(ext){
          case '.pug':
            handler.pug(req,res)
            break
          case '':
            handler.folder(req, res)
            break
          default:
            handler.file(req, res)
            break
        }
      }
      else {
        console.log(req.method + ' | ' + 'PATH   | ' + req.url)
        send(req, res, 200, { 'Content-Type': 'text/html' }, shellHtml())
      }
  }

  sociServer()
  return 0

  if(config.PRERENDER_HOST){
    //console.log(`Showing prerendered page: ${prerender.shouldShowPrerenderedPage(req)}`)
    if(prerender.shouldShowPrerenderedPage(req)) {
      console.log(prerender.getPrerenderedPageResponse(req, res => {
        console.log(res)
      }))
    }
    prerender.set("prerenderServiceUrl", config.PRERENDER_HOST)
    console.log(req.headers['user-agent'])
    prerender(req, res, sociServer)
  }
  else sociServer()
})

var sss = function(req) {
  var userAgent = req.headers['user-agent']
    , bufferAgent = req.headers['x-bufferbot']
    , isRequestingPrerenderedPage = false;

  if(!userAgent) return false;
  if(req.method != 'GET' && req.method != 'HEAD') return false;
  if(req.headers && req.headers['x-prerender']) return false;

  console.log('basic checks passed')

  //if it contains _escaped_fragment_, show prerendered page
  var parsedQuery = url.parse(req.url, true).query;
  if(parsedQuery && parsedQuery['_escaped_fragment_'] !== undefined) isRequestingPrerenderedPage = true;

  //if it is a bot...show prerendered page
  if(prerender.crawlerUserAgents.some(function(crawlerUserAgent){ return userAgent.toLowerCase().indexOf(crawlerUserAgent.toLowerCase()) !== -1;})) isRequestingPrerenderedPage = true;
  console.log(`it was a crawler? ${isRequestingPrerenderedPage}`)

  //if it is BufferBot...show prerendered page
  if(bufferAgent) isRequestingPrerenderedPage = true;

  console.log('almost there')
  //if it is a bot and is requesting a resource...dont prerender
  if(prerender.extensionsToIgnore.some(function(extension){return req.url.toLowerCase().indexOf(extension) !== -1;})) return false;

  console.log('almost there 2')
  //if it is a bot and not requesting a resource and is not whitelisted...dont prerender
  if(Array.isArray(prerender.whitelist) && prerender.whitelist.every(function(whitelisted){return (new RegExp(whitelisted)).test(req.url) === false;})) return false;

  //if it is a bot and not requesting a resource and is not blacklisted(url or referer)...dont prerender
  console.log('almost there 3')
  if(Array.isArray(prerender.blacklist) && prerender.blacklist.some(function(blacklisted){
    var blacklistedUrl = false
      , blacklistedReferer = false
      , regex = new RegExp(blacklisted);

    blacklistedUrl = regex.test(req.url) === true;
    if(req.headers['referer']) blacklistedReferer = regex.test(req.headers['referer']) === true;

    return blacklistedUrl || blacklistedReferer;
  })) return false;

  return isRequestingPrerenderedPage;
}

var handler = {
  error: function(req, res, err){
    res.writeHead(404, { 'Content-Type' : 'text/html' })
    res.end(err.message, 'utf-8')
    console.log(err)
  },
  pug: function(req, res){
    var filePath = '.' + req.url
    console.log(req.method + ' | ' + 'PUG    | ' + req.url)
    fs.readFile(filePath, 'utf8', (err, data) => {
      if(err){
        handler.error(req, res, err)
      }
      else {
        var html = pug.render(data, {doctype: 'html'})
        send(req, res, 200, { 'Content-Type': 'text/html' }, html)
      }
    })
  },
  folder: function(req, res){
    var html = 'no index found'
    var filePath = '.' + req.url
    console.log(req.method + ' | ' + 'FOLDER | ' + req.url)
    fs.readdir(filePath, function(err, files){
      if(err) {
        console.log(err)
        res.writeHead(200, { 'Content-Type' : 'text/html' })
        res.end(err.toString(), 'utf-8')
        return 0
      }
      if(files.indexOf('index.pug') != -1){
        if(!filePath.match(/\/$/)) filePath += '/'

        html = pug.renderFile(filePath + 'index.pug')
      }
      else {
        html = '<h1>Directory Listing</h1><ul>'
        for(var i = 0; i < files.length; i++){
          var path = req.url + files[i]
          html += '<li><a href="' + path + '">' + files[i] + '</a></li>'
        }
      }
      send(req, res, 200, { 'Content-Type': 'text/html' }, html)
    })
  },
  file: function(req, res){
    console.log(req.method + ' | ' + 'FILE   | ' + req.url)
    var mimetype = mime.lookup(req.url)
    if(mimetype == 'video/mp4' && req.headers.range){
      var file = req.url
      var range = req.headers.range
      var positions = range.replace(/bytes=/, "").split("-")
      var start = parseInt(positions[0], 10)

      fs.stat(file, function(err, stats) {
        var total = stats.size
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1
        var chunksize = (end - start) + 1

        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4"
        });

        var stream = fs.createReadStream(file, { start: start, end: end })
          .on("open", function() {
            stream.pipe(res)
          }).on("error", function(err) {
            res.end(err)
          })
      })
    }
    else {
      var filePath = resolveFile(req.url) || ('.' + req.url)
      fs.stat(filePath, function(err, stats){
        if(err){
          res.writeHead(404,{"Content-type":"text/plain"})
          res.end("Sorry the page was not found")
          return
        }
        // Bounded freshness + revalidation so warm loads don't re-download
        // every module. Not immutable: files aren't content-hashed.
        var etag = '"' + stats.size + '-' + Number(stats.mtimeMs) + '"'
        var headers = {
          'Cache-Control': 'max-age=300',
          'ETag': etag,
          'Last-Modified': stats.mtime.toUTCString()
        }
        if(mimetype) headers['Content-Type'] = mimetype
        if(req.headers['if-none-match'] == etag){
          res.writeHead(304, headers)
          res.end()
          return
        }
        fs.readFile(filePath, function(err, data){
          if(err){
            res.writeHead(404,{"Content-type":"text/plain"})
            res.end("Sorry the page was not found")
          }
          else {
            send(req, res, 200, headers, data, filePath + '|' + etag)
          }
        })
      })
    }
  }
}

server.listen(config.PORT)
console.log(`listening on ${config.PORT}`)
console.log('-----------------')
