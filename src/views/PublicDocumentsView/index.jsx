import { DocumentsView } from 'views/DocumentsView'

export class PublicDocumentsView extends DocumentsView {
  constructor () {
    super()
    this.title = 'Public sharing'
    this.pub = true
  }

  get header () {
    return null
  }
}

export default DocumentsView.connect(PublicDocumentsView)
