'use strict'

const EXP = /(<img.*app-src="([^"]*)"[^>]*)>/ig

export const resolveAttachmentUrl = function (doc, origin) {
  if (origin.indexOf(window.API_ROOT) === 0) {
    return origin
  }
  const attachment = doc.attachments.find((a) => a.origin === origin)
  if (attachment) {
    return `${window.API_ROOT}/document/${doc.id}/files/${attachment.key}`
  }
  return origin
}

export const filterDataSrcAttribute = function (doc) {
  if (doc.contentType.match(/^text\/html/)) {
    doc.content = doc.content.replace(EXP, function (match, p1, p2) {
      if (p1.indexOf(' src=') !== -1) {
        return p1 + '>'
      }
      const url = resolveAttachmentUrl(doc, p2)
      return p1 + ' src="' + url + '" >'
    })
  }
  return Promise.resolve(doc)
}

export default {
  filterDataSrcAttribute: filterDataSrcAttribute,
  resolveAttachmentUrl: resolveAttachmentUrl
}

