import React from 'react'
import { Route, IndexRedirect, Redirect } from 'react-router'

import RootLayout from 'layouts/RootLayout'
import MainLayout from 'layouts/MainLayout'
import PublicLayout from 'layouts/PublicLayout'
import LabelView from 'views/LabelView'
import ShareLabelView from 'views/ShareLabelView'
import DocumentView from 'views/DocumentView'
import LabelDocumentsView from 'views/LabelDocumentsView'
import SharedDocumentsView from 'views/SharedDocumentsView'
import PublicDocumentsView from 'views/PublicDocumentsView'
import PublicDocumentView from 'views/PublicDocumentView'
import DocumentsView from 'views/DocumentsView'
import BookmarkletView from 'views/BookmarkletView'
import GraveyardView from 'views/GraveyardView'
import SettingsView from 'views/SettingsView'
import WebhookView from 'views/WebhookView'
import ApiClientView from 'views/ApiClientView'
import SharingListView from 'views/SharingListView'

import { requireAuthentication } from 'middlewares/Authentication'

import {
  createNewDocument,
  fetchDocument,
  fetchDocuments,
  fetchLabel,
  fetchLabelAndSharing,
  fetchLabelAndDocument,
  fetchLabelAndDocuments,
  fetchSharedDocuments,
  fetchSharedDocument,
  fetchPublicDocuments,
  fetchPublicDocument,
  fetchSharing,
  fetchGraveyard
} from 'middlewares/Context'

const WebhookCreateView = props => <WebhookView {...props} mode='create' />
const WebhookEditView = props => <WebhookView {...props} mode='edit' />

const ApiClientCreateView = props => <ApiClientView {...props} mode='create' />
const ApiClientEditView = props => <ApiClientView {...props} mode='edit' />

export default (store) => (
  <Route path='/' component={RootLayout}>
    <IndexRedirect to='documents' />
    <Route path='bookmarklet' component={BookmarkletView} />
    <Route component={PublicLayout}>
      <Route path='pub/:sharingId' component={fetchPublicDocuments(PublicDocumentsView)} />
      <Route path='pub/:sharingId/:docId' component={fetchPublicDocument(PublicDocumentView)} />
    </Route>
    <Route component={requireAuthentication(MainLayout)}>
      <Route path='trash' component={fetchGraveyard(GraveyardView)} />
      <Route path='documents' component={fetchDocuments(DocumentsView)} />
      <Route path='documents/create' component={createNewDocument(DocumentView)} />
      <Route path='documents/:docId' component={fetchDocument(DocumentView)} />
      <Route path='labels/create' component={LabelView} />
      <Route path='labels/:labelId' component={fetchLabelAndDocuments(LabelDocumentsView)} />
      <Route path='labels/:labelId/edit' component={fetchLabel(LabelView)} />
      <Route path='labels/:labelId/share' component={fetchLabelAndSharing(ShareLabelView)} />
      <Route path='labels/:labelId/:docId' component={fetchLabelAndDocument(DocumentView)} />
      <Route path='sharing' component={fetchSharing(SharingListView)} />
      <Route path='sharing/:sharingId' component={fetchSharedDocuments(SharedDocumentsView)} />
      <Route path='sharing/:sharingId/:docId' component={fetchSharedDocument(DocumentView)} />
      <Route path='settings/:tab' component={SettingsView} />
      <Route path='settings/webhooks/create' component={WebhookCreateView} />
      <Route path='settings/webhooks/:id' component={WebhookEditView} />
      <Route path='settings/clients/create' component={ApiClientCreateView} />
      <Route path='settings/clients/:id' component={ApiClientEditView} />
    </Route>
    <Redirect from='/settings' to='/settings/bookmarklet' />
    <Redirect from='*' to='/documents' />
  </Route>
)
