let communityUsers = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(communityUsers)
  },
  onActivate: () => {
    let path = document.location.pathname
    let match = path.match(/^\/@([\w-]+)\/admin\/users/)
    if(!match) return
    let communityName = match[1]
    communityUsers.communityName = communityName
    document.title = `${communityName} - Users`
    
    communityUsers.loadUsers()
  },
  loadUsers: async () => {
    let res = await soci.getData(`/community/users?community=${communityUsers.communityName}`)
    if(res.error) {
        console.error(res.error)
        return
    }
    communityUsers.renderList('moderators', res.moderators)
    communityUsers.renderList('subscribers', res.subscribers)
    communityUsers.renderList('banned', res.banned)
  },
  renderList: (type, users) => {
    let container = communityUsers.dom.querySelector(`#${type}-list`)
    if(!container) return
    container.innerHTML = ''
    if(!users || users.length === 0) {
        container.innerHTML = '<div class="empty">No users found</div>'
        return
    }
    users.forEach(u => {
        let div = document.createElement('div')
        div.className = 'user-row'
        div.innerHTML = `
            <soci-user name="${u.username}"></soci-user>
            <div class="actions">
                ${communityUsers.getActions(type, u.username)}
            </div>
        `
        container.appendChild(div)
    })
  },
  getActions: (type, username) => {
    if(type === 'moderators') {
        return `<button onclick="communityUsers.removeModerator('${username}')">Remove Mod</button>`
    }
    if(type === 'subscribers') {
        return `
            <button onclick="communityUsers.addModerator('${username}')">Make Mod</button>
            <button onclick="communityUsers.banUser('${username}')">Ban</button>
        `
    }
    if(type === 'banned') {
        return `<button onclick="communityUsers.unbanUser('${username}')">Unban</button>`
    }
    return ''
  },
  addModerator: async (username) => {
    await soci.postData('/community/add-moderator', {
        community: communityUsers.communityName,
        username: username
    })
    communityUsers.loadUsers()
  },
  removeModerator: async (username) => {
    if(confirm(`Remove ${username} as moderator?`)) {
        await soci.postData('/community/remove-moderator', {
            community: communityUsers.communityName,
            username: username
        })
        communityUsers.loadUsers()
    }
  },
  banUser: async (username) => {
    if(confirm(`Ban ${username}?`)) {
        await soci.postData('/community/ban', {
            community: communityUsers.communityName,
            username: username
        })
        communityUsers.loadUsers()
    }
  },
  unbanUser: async (username) => {
    await soci.postData('/community/unban', {
        community: communityUsers.communityName,
        username: username
    })
    communityUsers.loadUsers()
  }
}

document.addEventListener('DOMContentLoaded', communityUsers.init)

