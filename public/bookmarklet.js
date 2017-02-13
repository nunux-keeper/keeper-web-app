window.kBookmarklet = function () {
  const cid = 'KPR_K__CONTAINER'
  const frameId = 'KPR_K__FRAME'
  let $c = document.getElementById(cid)

  let popup

  if (!$c) {
    $c = document.createElement('div')
    $c.id = cid
    $c.style.position = 'fixed'
    $c.style.background = '#fff'
    $c.style.bottom = '20px'
    $c.style.left = '20px'
    $c.style.width = '200px'
    $c.style.height = '200px'
    $c.style.zIndex = 999999999
    $c.style['box-shadow'] = '#000 4px 4px 20px'
    $c.style['border-radius'] = '4px'
    var $o = document.createElement('div')
    $o.style.position = 'absolute'
    $o.style.height = '160px'
    $o.style.top = '40px'
    $o.style.right = 0
    $o.style.width = '200px'
    $o.style.background = 'transparent'
    $o.style.cursor = 'pointer'
    $o.addEventListener('dragenter', function (e) {
      popup.postMessage(JSON.stringify({ _type: 'onDragEnter' }), window.K_REALM)
    }, false)
    $o.addEventListener('dragover', function (e) {
      if (e.preventDefault) {
        e.preventDefault()
      }
      return false
    }, false)
    $o.addEventListener('dragleave', function (e) {
      popup.postMessage(JSON.stringify({ _type: 'onDragLeave' }), window.K_REALM)
    }, false)
    $o.addEventListener('drop', function (e) {
      if (e.preventDefault) {
        e.preventDefault()
      }
      var data = e.dataTransfer.getData('text/html')
      popup.postMessage(JSON.stringify({ _type: 'onDropData', data: data }), window.K_REALM)
      return false
    }, false)
    $o.addEventListener('click', function (e) {
      popup.postMessage(JSON.stringify({ _type: 'onClick' }), window.K_REALM)
    }, false)
    $c.appendChild($o)
    document.body.appendChild($c)
  }

  var $ifrm = document.createElement('iframe')
  $ifrm.setAttribute('id', frameId)
  $ifrm.setAttribute('name', frameId)
  $ifrm.style.width = '100%'
  $ifrm.style.height = '100%'
  $ifrm.style.border = 'none'
  $ifrm.style.margin = 0

  $c.appendChild($ifrm)

  var url = window.K_REALM.replace(/\/$/, '') + '/bookmarklet?url=' +
    encodeURIComponent(window.location.href) +
    '&title=' + encodeURIComponent(window.document.title)

  popup = window.open(url, frameId)
  if (!popup) alert('Unable to load bookmarklet.')

  var receiveMessage = function (e) {
    let msg
    try {
      msg = JSON.parse(e.data)
    } catch (e) {
      console.error('Unable to parse received event data', e)
      return
    }
    if (msg._type === 'close' && window.K_REALM.indexOf(e.origin) === 0) {
      $c.parentNode.removeChild($c)
    } else if (msg._type === 'redirect') {
      console.log('Redirecting to ', msg.payload)
      document.location.replace(msg.payload)
    }
  }
  window.addEventListener('message', receiveMessage, false)
  setInterval(function () {
    popup.postMessage(JSON.stringify({ _type: 'ping' }), window.K_REALM)
  }, 2000)
}

window.kBookmarklet()
