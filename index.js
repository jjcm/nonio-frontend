import config from './config.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

var http = require('http')
var fs = require('fs')
var path = require('path')
var pug = require('pug')
var url = require('url')
var mime = require('mime-types')
var stylus = require('stylus')
var prerender = require('prerender-node')


var server = http.createServer(function (req, res) {

  var sociServer = () => {
      var ext = path.extname(req.url)
      if(fs.existsSync('.' + req.url)) {
        switch(ext){
          case '.pug':
            handler.pug(req,res)
            break
          case '.styl':
            handler.styl(req,res)
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
        let html = pug.renderFile('index.pug')
        res.end(html, 'utf-8')
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
        var html = pug.render(data)
        res.writeHead(200, { 'Content-Type' : 'text/html' })
        res.end(html, 'utf-8')
      }
    })
  },
  styl: function(req, res){
    var filePath = '.' + req.url
    console.log(req.method + ' | ' + 'STYLUS | ' + req.url)
    fs.readFile(filePath, 'utf8', (err, data) => {
      if(err){
        handler.error(req, res, err)
      }
      else {
        stylus.render(data, {filename: filePath}, (err, css) => {
          if(err){
            handler.error(req, res, err)
          }
          else {
            res.writeHead(200, { 'Content-Type' : 'text/css' })
            res.end(css, 'utf-8')
          }
        })
      }
    })
  },
  folder: function(req, res){
    var html = 'no index found'
    var filePath = '.' + req.url
    console.log(req.method + ' | ' + 'FOLDER | ' + req.url)
    fs.readdir(filePath, function(err, files){
      res.writeHead(200, { 'Content-Type' : 'text/html' })
      if(err) {
        console.log(err)
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
      res.end(html, 'utf-8')
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
      fs.readFile('.' + req.url, function(err, data){
        if(err){
          res.writeHead(404,{"Content-type":"text/plain"})
          res.end("Sorry the page was not found")
        }
        else {
          if(mimetype)
            res.writeHead(200, { 'Content-Type': mimetype })
          res.end(data)
        }
      })
    }
  }
}

server.listen(config.PORT)
console.log(`listening on ${config.PORT}`)
console.log('-----------------')
