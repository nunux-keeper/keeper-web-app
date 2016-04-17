import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import RootLayout from 'layouts/RootLayout'
import MainLayout from 'layouts/MainLayout'
import NotFoundView from 'views/NotFoundView/NotFoundView'
import HomeView from 'views/HomeView/HomeView'
import LoginView from 'views/LoginView/LoginView'
import LabelView from 'views/LabelView/LabelView'
import DocumentsView from 'views/DocumentsView/DocumentsView'
import DocumentView from 'views/DocumentView/DocumentView'

import { requireAuthentication } from 'middlewares/Authentication'

import {
  createDocument,
  fetchDocument,
  fetchDocuments,
  fetchLabel,
  fetchLabelAndDocument,
  fetchLabelAndDocuments
} from 'middlewares/Context'

export default (store) => (
  <Route path='/' component={RootLayout}>
    <IndexRoute component={HomeView} />
    <Route component={MainLayout}>
      <Route path='login' component={LoginView} />
    </Route>
    <Route component={requireAuthentication(MainLayout)}>
      <Route path='document' component={fetchDocuments(DocumentsView)} />
      <Route path='document/create' component={createDocument(DocumentView)} />
      <Route path='document/:docId' component={fetchDocument(DocumentView)} />
      <Route path='label/create' component={LabelView} />
      <Route path='label/:labelId' component={fetchLabelAndDocuments(DocumentsView)} />
      <Route path='label/:labelId/edit' component={fetchLabel(LabelView)} />
      <Route path='label/:labelId/:docId' component={fetchLabelAndDocument(DocumentView)} />
    </Route>
    <Route path='/404' component={NotFoundView} />
    <Redirect from='*' to='/404' />
  </Route>
)
