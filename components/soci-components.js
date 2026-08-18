import SociComponent from './soci-component.js'

import SociRoute from "./soci-route.js"
window.customElements.define('soci-route', SociRoute)

import SociRouter from "./soci-router.js"
window.sociRouter = new SociRouter()

import SociButton from "./soci-button.js"
window.customElements.define('soci-button', SociButton)

import SociIcon from "./soci-icon.js"
window.customElements.define('soci-icon', SociIcon)

import SociImage from "./soci-image.js"
window.customElements.define('soci-image', SociImage)

import SociInput from "./soci-input.js"
window.customElements.define('soci-input', SociInput)

import SociLink from "./soci-link.js"
window.customElements.define('soci-link', SociLink)

import SociModal from "./soci-modal.js"
window.customElements.define('soci-modal', SociModal)

import SociNotificationBadge from "./soci-notification-badge.js"
window.customElements.define('soci-notification-badge', SociNotificationBadge)

import SociMarkdownView from "./soci-markdown-view.js"
window.customElements.define('soci-markdown-view', SociMarkdownView)

import SociPassword from "./soci-password.js"
window.customElements.define('soci-password', SociPassword)

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

import SociLoginModal from "./modals/soci-login-modal.js"
window.customElements.define('soci-login-modal', SociLoginModal)

import SociCreateAccountModal from "./modals/soci-create-account-modal.js"
window.customElements.define('soci-create-account-modal', SociCreateAccountModal)

import SociCreateCommunityModal from "./modals/soci-create-community-modal.js"
window.customElements.define('soci-create-community-modal', SociCreateCommunityModal)

import SociCreateChannelModal from "./modals/soci-create-channel-modal.js"
window.customElements.define('soci-create-channel-modal', SociCreateChannelModal)

import SociImageViewerModal from "./modals/soci-image-viewer-modal.js"
window.customElements.define('soci-image-viewer-modal', SociImageViewerModal)

import "./modals/soci-modal-manager.js"

import SociTab from "./soci-tab.js"
window.customElements.define('soci-tab', SociTab)

import SociTabGroup from "./soci-tab-group.js"
window.customElements.define('soci-tab-group', SociTabGroup)

import SociTag from "./soci-tag.js"
window.customElements.define('soci-tag', SociTag)

import SociTagGroup from "./soci-tag-group.js"
window.customElements.define('soci-tag-group', SociTagGroup)

import SociTagLi from "./soci-tag-li.js"
window.customElements.define('soci-tag-li', SociTagLi)

import SociVoiceChannelLi from "./soci-voice-channel-li.js"
window.customElements.define('soci-voice-channel-li', SociVoiceChannelLi)

import SociTextChannelLi from "./soci-text-channel-li.js"
window.customElements.define('soci-text-channel-li', SociTextChannelLi)

import SociUsernameInput from "./soci-username-input.js"
window.customElements.define('soci-username-input', SociUsernameInput)

import SociUser from "./soci-user.js"
window.customElements.define('soci-user', SociUser)

import SociVideo from "./soci-video.js"
window.customElements.define('soci-video', SociVideo)
