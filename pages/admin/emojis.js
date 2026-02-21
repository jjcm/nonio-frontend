let adminEmojis = {
  dom: document.currentScript.closest('soci-route'),
  init: () => soci.registerPage(adminEmojis),
  onActivate: () => {
    const form = adminEmojis.dom.querySelector('#emoji-form')
    form?.addEventListener('submit', adminEmojis.upload)
    adminEmojis.load()
  },
  load: async () => {
    const grid = adminEmojis.dom.querySelector('#emoji-grid')
    if (!grid) return
    const sets = await window.api.emoji.sets().catch(() => null)
    const emojis = sets?.personal || []
    grid.innerHTML = emojis.map(e => `
      <div class="emoji-card">
        <img src="${window.config.AVATAR_HOST}/${e.key}.webp" alt="${e.name}" data-emoji-id="${e.id}">
        <div class="emoji-name">:${e.name}:</div>
      </div>
    `).join('')
  },
  upload: async (e) => {
    e.preventDefault()
    const name = (adminEmojis.dom.querySelector('#emoji-name')?.value || '').trim().toLowerCase()
    const file = adminEmojis.dom.querySelector('#emoji-file')?.files?.[0]
    const btn = adminEmojis.dom.querySelector('#emoji-upload')
    if (!name || !file) return
    btn?.wait?.()
    const fd = new FormData()
    fd.append('files', file)
    fd.append('type', 'emoji')
    fd.append('name', name)
    const uploadRes = await fetch(window.config.AVATAR_HOST + '/upload', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + soci.accessToken },
      body: fd
    }).catch(() => null)
    if (!uploadRes?.ok) { btn?.error?.(); return }
    const raw = (await uploadRes.text()).trim()
    const animated = raw.endsWith('.animated')
    const key = raw.replace(/\.animated$/, '')
    const create = await window.api.emoji.createPersonal({ name, key, animated }).catch(() => null)
    if (create?.id) {
      btn?.success?.()
      adminEmojis.dom.querySelector('#emoji-file').value = ''
      adminEmojis.load()
      return
    }
    btn?.error?.()
  }
}

adminEmojis.init()
