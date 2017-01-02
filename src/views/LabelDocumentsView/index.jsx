import { DocumentsView } from 'views/DocumentsView'

export class LabelDocumentsView extends DocumentsView {
  constructor () {
    super()
    this.contextMenuItems = 'refresh,order,divider,editLabel,shareLabel,divider,deleteLabel'
    this.headerIcon = 'tag'
  }

  get label () {
    const { label } = this.props
    return label.current ? label.current : {label: 'Undefined'}
  }

  set title (title) {
    this._title = title
  }

  get title () {
    return this.label.label
  }

  set headerStyle (style) {
    this._headerStyle = style
  }

  get headerStyle () {
    return {backgroundColor: this.label.color}
  }

  get creatDocumentLink () {
    const link = super.creatDocumentLink()
    link.query = {
      labels: [this.label.id]
    }
  }
}

export default DocumentsView.connect(LabelDocumentsView)
