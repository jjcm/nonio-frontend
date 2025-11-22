let communityAdmin = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(communityAdmin)
  },
  onActivate: () => {
    let path = document.location.pathname
    let match = path.match(/^\/@([\w-]+)\/admin$/)
    if(!match) return
    let communityName = match[1]
    communityAdmin.communityName = communityName
    document.title = `Admin - ${communityName}`

    communityAdmin.loadModerators()
    
    communityAdmin.dom.querySelector('#add-mod').addEventListener('click', communityAdmin.addModerator)
  },
  loadModerators: async () => {
    let res = await soci.getData(`community/moderators?community=${communityAdmin.communityName}`)
    let modList = communityAdmin.dom.querySelector('#mod-list')
    modList.innerHTML = ''
    if(res.moderators) {
        res.moderators.forEach(mod => {
            let div = document.createElement('div')
            div.innerHTML = `
                <span>${mod.username}</span>
                <button onclick="communityAdmin.removeModerator('${mod.username}')">Remove</button>
            `
            modList.appendChild(div)
        })
    }
  },
  addModerator: async () => {
    let username = communityAdmin.dom.querySelector('#new-mod').value
    await window.api.community.addModerator({
        community: communityAdmin.communityName,
        username: username
    })
    communityAdmin.loadModerators()
  },
  removeModerator: async (username) => {
    if(confirm(`Remove ${username}?`)) {
        await window.api.community.removeModerator({
            community: communityAdmin.communityName,
            username: username
        })
        communityAdmin.loadModerators()
    }
  }
}

document.addEventListener('DOMContentLoaded', communityAdmin.init)

