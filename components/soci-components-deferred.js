// Components not needed for first paint of the feed/tags route.
// Loaded by soci-components.js after the window load event; custom elements
// upgrade in place when defined, so later routes (post, submit, channels,
// ledger, modals) keep working.

import SociAvatarUploader from "./soci-avatar-uploader.js"
window.customElements.define('soci-avatar-uploader', SociAvatarUploader)

import SociBanner from "./soci-banner.js"
window.customElements.define('soci-banner', SociBanner)

import SociComment from "./soci-comment.js"
window.customElements.define('soci-comment', SociComment)

import SociContributionSlider from "./soci-contribution-slider.js"
window.customElements.define('soci-contribution-slider', SociContributionSlider)

import SociCommentList from "./soci-comment-list.js"
window.customElements.define('soci-comment-list', SociCommentList)

import SociHTMLPage from "./soci-html-page.js"
window.customElements.define('soci-html-page', SociHTMLPage)

import SociHTMLUploader from "./soci-html-uploader.js"
window.customElements.define('soci-html-uploader', SociHTMLUploader)

import SociImage from "./soci-image.js"
window.customElements.define('soci-image', SociImage)

import SociImageUploader from "./soci-image-uploader.js"
window.customElements.define('soci-image-uploader', SociImageUploader)

import SociInput from "./soci-input.js"
window.customElements.define('soci-input', SociInput)

import SociLedgerLi from "./soci-ledger-li.js"
window.customElements.define('soci-ledger-li', SociLedgerLi)

import SociLedgerMonth from "./soci-ledger-month.js"
window.customElements.define('soci-ledger-month', SociLedgerMonth)

import SociLedger from "./soci-ledger.js"
window.customElements.define('soci-ledger', SociLedger)

import SociLinkInput from "./soci-link-input.js"
window.customElements.define('soci-link-input', SociLinkInput)

import SociModal from "./soci-modal.js"
window.customElements.define('soci-modal', SociModal)

import SociMessageRow from "./soci-message-row.js"
window.customElements.define('soci-message-row', SociMessageRow)

import SociPassword from "./soci-password.js"
window.customElements.define('soci-password', SociPassword)

import SociPost from "./soci-post.js"
window.customElements.define('soci-post', SociPost)

import SociTab from "./soci-tab.js"
window.customElements.define('soci-tab', SociTab)

import SociTabGroup from "./soci-tab-group.js"
window.customElements.define('soci-tab-group', SociTabGroup)

import SociUrlInput from "./soci-url-input.js"
window.customElements.define('soci-url-input', SociUrlInput)

import SociVoiceChannelLi from "./soci-voice-channel-li.js"
window.customElements.define('soci-voice-channel-li', SociVoiceChannelLi)

import SociTextChannelLi from "./soci-text-channel-li.js"
window.customElements.define('soci-text-channel-li', SociTextChannelLi)

import SociTextChannelViewThreaded from "./soci-text-channel-view-threaded.js"
window.customElements.define('soci-text-channel-view', SociTextChannelViewThreaded)

import SociUsernameInput from "./soci-username-input.js"
window.customElements.define('soci-username-input', SociUsernameInput)

import SociUserPicker from "./soci-user-picker.js"
window.customElements.define('soci-user-picker', SociUserPicker)

import SociUserComment from "./soci-user-comment.js"
window.customElements.define('soci-user-comment', SociUserComment)

import SociUserCommentList from "./soci-user-comment-list.js"
window.customElements.define('soci-user-comment-list', SociUserCommentList)

import SociVideo from "./soci-video.js"
window.customElements.define('soci-video', SociVideo)

import SociVideoUploader from "./soci-video-uploader.js"
window.customElements.define('soci-video-uploader', SociVideoUploader)

import SociEncodingProgress from "./soci-encoding-progress.js"
window.customElements.define('soci-encoding-progress', SociEncodingProgress)

import SociRadialProgress from "./soci-radial-progress.js"
window.customElements.define('soci-radial-progress', SociRadialProgress)

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
