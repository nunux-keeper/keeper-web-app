import AbstractApi from 'api/common/AbstractApi'

export class ExportApi extends AbstractApi {

  getStatus (onProgress) {
    return this.sse('/exports/status', {})
      .then(source => {
        return new Promise((resolve, reject) => {
          source.addEventListener('progress', evt => {
            // console.log('EventSource data:', evt.data)
            onProgress(evt.data)
          }, false)
          source.addEventListener('complete', evt => {
            source.close()
            return resolve(evt.data)
          }, false)
          source.addEventListener('error', (evt) => {
            console.log('EventSource error:', evt)
            source.close()
            return reject(evt.data || 'Unable to get export status')
          }, false)
        })
      })
  }

  schedule () {
    return this.fetch('/exports', {
      method: 'post'
    })
  }

  getDownloadUrl () {
    return this.resolveUrl('/exports')
  }
}

const instance = new ExportApi()
export default instance
