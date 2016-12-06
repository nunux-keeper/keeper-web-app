import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import RootLayout from 'layouts/RootLayout'
import MainLayout from 'layouts/MainLayout'
import NotFoundView from 'views/NotFoundView/NotFoundView'
import HomeView from 'views/HomeView/HomeView'
import LabelView from 'views/LabelView/LabelView'
import ShareLabelView from 'views/ShareLabelView/ShareLabelView'
import DocumentsView from 'views/DocumentsView/DocumentsView'
import DocumentView from 'views/DocumentView/DocumentView'
import BookmarkletView from 'views/BookmarkletView/BookmarkletView'
import GraveyardView from 'views/GraveyardView/GraveyardView'
import SettingsView from 'views/SettingsView/SettingsView'

import { requireAuthentication } from 'middlewares/Authentication'

import {
  createNewDocument,
  fetchDocument,
  fetchDocuments,
  fetchLabel,
  fetchLabelAndDocument,
  fetchLabelAndDocuments,
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
      <Route path='label/:labelId/share' component={fetchLabel(ShareLabelView)} />
      <Route path='label/:labelId/:docId' component={fetchLabelAndDocument(DocumentView)} />
      <Route path='settings' component={SettingsView} />
    </Route>
    <Route path='/404' component={NotFoundView} />
    <Redirect from='*' to='/404' />
  </Route>
)
