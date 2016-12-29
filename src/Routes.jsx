import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import RootLayout from 'layouts/RootLayout'
import MainLayout from 'layouts/MainLayout'
import HomeView from 'views/HomeView'
import LabelView from 'views/LabelView'
import ShareLabelView from 'views/ShareLabelView'
import DocumentsView from 'views/DocumentsView'
import DocumentView from 'views/DocumentView'
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
  fetchSharing,
  fetchGraveyard
} from 'middlewares/Context'

export default (store) => (
  <Route path='/' component={RootLayout}>
    <IndexRoute component={HomeView} />
    <Route component={requireAuthentication(MainLayout)}>
      <Route path='bookmarklet' component={BookmarkletView} />
      <Route path='trash' component={fetchGraveyard(GraveyardView)} />
      <Route path='document' component={fetchDocuments(DocumentsView)} />
      <Route path='document/create' component={createNewDocument(DocumentView)} />
      <Route path='document/:docId' component={fetchDocument(DocumentView)} />
      <Route path='label/create' component={LabelView} />
      <Route path='label/:labelId' component={fetchLabelAndDocuments(DocumentsView)} />
      <Route path='label/:labelId/edit' component={fetchLabel(LabelView)} />
      <Route path='label/:labelId/share' component={fetchLabelAndSharing(ShareLabelView)} />
      <Route path='label/:labelId/:docId' component={fetchLabelAndDocument(DocumentView)} />
      <Route path='sharing' component={fetchSharing(SharingListView)} />
      <Route path='settings' component={SettingsView} />
    </Route>
    <Redirect from='*' to='/document' />
  </Route>
)
