import AbstractApi from 'api/common/AbstractApi'

export class ClientApi extends AbstractApi {
  all (params) {
    return this.fetch('/clients')
  }

  get (id) {
    return this.fetch(`/clients/${id}`)
  }

  create (client) {
    return this.fetch('/clients', {
      method: 'post',
      body: JSON.stringify(client)
    })
  }

  update (client, update) {
    return this.fetch(`/clients/${client.id}`, {
      method: 'put',
      body: JSON.stringify(update)
    })
  }

  remove (client) {
    return this.fetch(`/clients/${client.id}`, {
      method: 'delete'
    })
  }
}

const instance = new ClientApi()
export default instance
