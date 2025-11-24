let communitySettings = {
  dom: document.currentScript.closest('soci-route'),
  init: () => {
    soci.registerPage(communitySettings)
  },
  onActivate: () => {
    let path = document.location.pathname
    let match = path.match(/^\/@([\w-]+)\/admin/)
    if(!match) return
    let communityName = match[1]
    communitySettings.communityName = communityName
    document.title = `${communityName} - Settings`
    
    communitySettings.loadSettings()

    communitySettings.dom.querySelector('form').addEventListener('submit', communitySettings.saveSettings)
    
    let avatarInput = communitySettings.dom.querySelector('soci-avatar-uploader')
    // Assuming soci-avatar-uploader handles 'community' attribute
    // If not, I might need to update it or use a workaround
    // The backend expects 'community' param in upload.
  },
  loadSettings: async () => {
    let res = await soci.getData(`/communities/${communitySettings.communityName}`)
    if(res.error) {
        console.error(res.error)
        return
    }
    let form = communitySettings.dom.querySelector('form')
    form.querySelector('input[name="name"]').value = res.name
    form.querySelector('textarea[name="description"]').value = res.description
    form.querySelector('select[name="privacy"]').value = res.privacyType
    form.querySelector('select[name="post_permission"]').value = res.postPermission || 'all'
    form.querySelector('select[name="comment_permission"]').value = res.commentPermission || 'all'
  },
  saveSettings: async (e) => {
    e.preventDefault()
    let form = communitySettings.dom.querySelector('form')
    let button = form.querySelector('soci-button')
    button.wait()
    
    let data = {
        community: communitySettings.communityName,
        name: form.querySelector('input[name="name"]').value,
        description: form.querySelector('textarea[name="description"]').value,
        privacyType: form.querySelector('select[name="privacy"]').value,
        postPermission: form.querySelector('select[name="post_permission"]').value,
        commentPermission: form.querySelector('select[name="comment_permission"]').value
    }
    
    let res = await soci.postData('/community/update', data)
    if(res === true) {
        button.success()
    } else {
        button.error()
    }
  }
}

document.addEventListener('DOMContentLoaded', communitySettings.init)

