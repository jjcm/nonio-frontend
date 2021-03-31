import SociComponent from './soci-component.js'

export default class SociCommentList extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      :host {
        display: block;
        padding: 2px 8px;
      }
      content {
        display: block;
        padding: 0 20px 24px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      ::slotted(soci-comment) {
        padding-left: 0;
        padding: 12px 20px;
        margin: 8px 0;
        border-radius: 8px;
        background: var(--base-background);
        box-shadow: 0px 1px 3px var(--shadow);
      }
    `
  }

  static get observedAttributes() {
    return ['user']
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name) {
      case 'user':
        this.renderComments(newValue)
        break
    }
  }

  async renderComments(username){
    let comments = await this.getData('/comments/user/' + username)
    comments = comments.comments
    /* TODO
    let votes = await this.getData('/comment-votes/user/' + username, this.authToken)
    votes = votes.votes
    */

    comments.forEach(comment => {
      let newComment = document.createElement('soci-user-comment')
      newComment = newComment.factory(comment.user, comment.upvotes - comment.downvotes, comment.lineage_score, comment.date, comment.id, comment.content, comment.post, comment.post_title)
      this.appendChild(newComment)
    })

    /* TODO
    votes.forEach(vote => {
      let comment = this.querySelector(`soci-comment[comment-id="${vote.comment_id}`)
      comment.showVote(vote.upvote)
    })
    */
  }
}
