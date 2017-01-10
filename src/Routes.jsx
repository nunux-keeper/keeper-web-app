import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import RootLayout from 'layouts/RootLayout'
import MainLayout from 'layouts/MainLayout'
import HomeView from 'views/HomeView'
import LabelView from 'views/LabelView'
import ShareLabelView from 'views/ShareLabelView'
import DocumentView from 'views/DocumentView'
import LabelDocumentsView from 'views/LabelDocumentsView'
import SharedDocumentsView from 'views/SharedDocumentsView'
import DocumentsView from 'views/DocumentsView'
import BookmarkletView from 'views/BookmarkletView'
import GraveyardView from 'views/GraveyardView'
import SettingsView from 'views/SettingsView'
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
  fetchSharedDocument,
  fetchSharing,
  fetchGraveyard
} from 'middlewares/Context'

export default (store) => (
  <Route path='/' component={RootLayout}>
    <IndexRoute component={HomeView} />
    <Route path='bookmarklet' component={BookmarkletView} />
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
      <Route path='sharing/:sharingId' component={fetchDocuments(SharedDocumentsView)} />
      <Route path='sharing/:sharingId/:docId' component={fetchSharedDocument(DocumentView)} />
      <Route path='settings' component={SettingsView} />
    </Route>
    <Redirect from='*' to='/documents' />
  </Route>
)
