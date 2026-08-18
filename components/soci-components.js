import SociComponent from './soci-component.js'

import SociRoute from "./soci-route.js"
window.customElements.define('soci-route', SociRoute)

import SociRouter from "./soci-router.js"
window.sociRouter = new SociRouter()

import SociButton from "./soci-button.js"
window.customElements.define('soci-button', SociButton)

import SociIcon from "./soci-icon.js"
window.customElements.define('soci-icon', SociIcon)

import SociLink from "./soci-link.js"
window.customElements.define('soci-link', SociLink)

import SociNotificationBadge from "./soci-notification-badge.js"
window.customElements.define('soci-notification-badge', SociNotificationBadge)

import SociMarkdownView from "./soci-markdown-view.js"
window.customElements.define('soci-markdown-view', SociMarkdownView)

import SociPostLi from "./soci-post-li.js"
window.customElements.define('soci-post-li', SociPostLi)

import SociPostCard from "./soci-post-card.js"
window.customElements.define('soci-post-card', SociPostCard)

import SociPostList from "./soci-post-list.js"
window.customElements.define('soci-post-list', SociPostList)

import {SociSelect, SociOption} from "./soci-select.js"
window.customElements.define('soci-select', SociSelect)
window.customElements.define('soci-option', SociOption)

import SociRadioButton from "./soci-radio-button.js"
window.customElements.define('soci-radio-button', SociRadioButton)

import SociRadioButtonGroup from "./soci-radio-button-group.js"
window.customElements.define('soci-radio-button-group', SociRadioButtonGroup)

import SociSidebar from "./soci-sidebar.js"
window.customElements.define('soci-sidebar', SociSidebar)

import SociSidebarSwitcher from "./soci-sidebar-switcher.js"
window.customElements.define('soci-sidebar-switcher', SociSidebarSwitcher)

import {SociSidebarPanel, SociSidebarCommunityPanel, SociSidebarUserPanel} from "./soci-sidebar-panel.js"
window.customElements.define('soci-sidebar-panel', SociSidebarPanel)
window.customElements.define('soci-sidebar-community-panel', SociSidebarCommunityPanel)
window.customElements.define('soci-sidebar-user-panel', SociSidebarUserPanel)

import "./modals/soci-modal-manager.js"

import SociTag from "./soci-tag.js"
window.customElements.define('soci-tag', SociTag)

import SociTagGroup from "./soci-tag-group.js"
window.customElements.define('soci-tag-group', SociTagGroup)

import SociTagLi from "./soci-tag-li.js"
window.customElements.define('soci-tag-li', SociTagLi)

import SociUser from "./soci-user.js"
window.customElements.define('soci-user', SociUser)

// Everything else (post detail, comments, uploaders, channels, ledger,
// modals) is off the feed's first paint; load it once the page has loaded.
// Elements already in the DOM upgrade when their definitions arrive.
const loadDeferred = () => import('./soci-components-deferred.js')
if(document.readyState == 'complete') loadDeferred()
else window.addEventListener('load', loadDeferred, {once: true})
