import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

function getParameterByName (name, url) {
  if (!url) {
    url = window.location.href
  }
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// Redirect if require by the query params
const redirect = getParameterByName('redirect')
if (redirect) {
  console.log(`Redirecting to ${redirect} ...`)
  document.location.replace(redirect)
} else {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
}

