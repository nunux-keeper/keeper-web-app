import AbstractApi from 'api/common/AbstractApi'

export class WebhookApi extends AbstractApi {
  all (params) {
    return this.fetch('/webhooks')
  }

  get (id) {
    return this.fetch(`/webhooks/${id}`)
  }

  create (webhook) {
    return this.fetch('/webhooks', {
      method: 'post',
      body: JSON.stringify(webhook)
    })
  }

  update (webhook, update) {
    return this.fetch(`/webhooks/${webhook.id}`, {
      method: 'put',
      body: JSON.stringify(update)
    })
  }

  remove (webhook) {
    return this.fetch(`/webhooks/${webhook.id}`, {
      method: 'delete'
    })
  }
}

const instance = new WebhookApi()
export default instance
