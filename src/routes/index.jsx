import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import RootLayout from 'layouts/RootLayout'
import MainLayout from 'layouts/MainLayout'
import NotFoundView from 'views/NotFoundView/NotFoundView'
import HomeView from 'views/HomeView/HomeView'
import LoginView from 'views/LoginView/LoginView'
import DocumentsView from 'views/DocumentsView/DocumentsView'
import DocumentView from 'views/DocumentView/DocumentView'

import { requireAuthentication } from 'components/AuthenticatedComponent'

export default (
  <Route path='/' component={RootLayout}>
    <IndexRoute component={HomeView} />
    <Route component={MainLayout}>
      <Route path='login' component={LoginView} />
      <Route path='document' component={requireAuthentication(DocumentsView)} />
      <Route path='document/:docId' component={requireAuthentication(DocumentView)} />
      <Route path='label/:labelId' component={requireAuthentication(DocumentsView)} />
      <Route path='label/:labelId/:docId' component={requireAuthentication(DocumentView)} />
    </Route>
    <Route path='/404' component={NotFoundView} />
    <Redirect from='*' to='/404' />
  </Route>
)
