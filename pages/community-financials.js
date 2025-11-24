let communityFinancials = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(communityFinancials)
  },
  onActivate: () => {
    let path = document.location.pathname
    let match = path.match(/^\/@([\w-]+)\/admin\/financials/)
    if(!match) return
    let communityName = match[1]
    communityFinancials.communityName = communityName
    document.title = `${communityName} - Financials`
    
    communityFinancials.loadFinancials()
  },
  loadFinancials: async () => {
    let res = await soci.getData(`/community/financials?community=${communityFinancials.communityName}`)
    if(res.error) {
        console.error(res.error)
        return
    }
    
    let tbody = communityFinancials.dom.querySelector('tbody')
    tbody.innerHTML = ''
    if(res.financials && res.financials.length > 0) {
        res.financials.forEach(f => {
            let tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${f.username}</td>
                <td>$${f.amount.toFixed(2)}</td>
            `
            tbody.appendChild(tr)
        })
    } else {
        tbody.innerHTML = '<tr><td colspan="2">No earnings recorded for this period.</td></tr>'
    }
  }
}

document.addEventListener('DOMContentLoaded', communityFinancials.init)

