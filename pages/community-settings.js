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
    
    // Fetch settings
    communitySettings.loadSettings()

    // Bind events
    let saveButton = communitySettings.dom.querySelector('soci-button')
    saveButton.addEventListener('click', communitySettings.saveSettings)
  },
  loadSettings: async () => {
    let res = await soci.getData(`communities/${communitySettings.communityName}`)
    if(res.error) {
        console.error(res.error)
        return
    }
    let form = communitySettings.dom.querySelector('form')
    form.querySelector('input[name="name"]').value = res.name
    let descInput = form.querySelector('soci-input[name="description"]')
    try {
      JSON.parse(res.description)
      descInput.value = res.description
    } catch(e) {
      descInput.setText(res.description)
    }
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
        description: form.querySelector('soci-input[name="description"]').value,
        privacyType: form.querySelector('select[name="privacy"]').value,
        postPermission: form.querySelector('select[name="post_permission"]').value,
        commentPermission: form.querySelector('select[name="comment_permission"]').value
    }
    
    let res = await soci.postData('community/update', data)
    if(res === true) {
        button.success()
    } else {
        button.error()
    }
  }
}

communitySettings.init()

