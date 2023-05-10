import wSocket from './wSocket.class.js'
import Content from './content.class.js'
import Guardias from './guardias.class.js'
import {$, $$, shadeColor, updateTime} from '../exports.web.js'

const CONF = window.ipc.get.appConf()

/*======================================================================
====================            ASPECTO            =====================
======================================================================*/

  // Bloques
  const infoTpl = $('infoTpl')
  const mediaTpl = $('mediaContentTpl')
  const guardiasTpl = $('guardiasTpl')
  const bodyMain = $$('body.main')

  switch (CONF.interface.order) {
    case 0: // Info, contenidos, guardias
      bodyMain.appendChild(infoTpl.content.cloneNode(true))
      bodyMain.appendChild(mediaTpl.content.cloneNode(true))
      bodyMain.appendChild(guardiasTpl.content.cloneNode(true))    
    break;
    case 1: // Info, guardias, contenidos
      bodyMain.appendChild(infoTpl.content.cloneNode(true))
      bodyMain.appendChild(guardiasTpl.content.cloneNode(true))    
      bodyMain.appendChild(mediaTpl.content.cloneNode(true))
    break;
    case 2: // Guardias, info, contenidos
      bodyMain.appendChild(guardiasTpl.content.cloneNode(true))    
      bodyMain.appendChild(infoTpl.content.cloneNode(true))
      bodyMain.appendChild(mediaTpl.content.cloneNode(true))
    break;
    case 3: // Guardias, contenidos, info
      bodyMain.appendChild(guardiasTpl.content.cloneNode(true))    
      bodyMain.appendChild(mediaTpl.content.cloneNode(true))
      bodyMain.appendChild(infoTpl.content.cloneNode(true))
    break;
    case 4: // Contenidos, guardias, info
      bodyMain.appendChild(mediaTpl.content.cloneNode(true))
      bodyMain.appendChild(guardiasTpl.content.cloneNode(true))    
      bodyMain.appendChild(infoTpl.content.cloneNode(true))
    break;
    case 5: // Contenidos, info, guardias
      bodyMain.appendChild(mediaTpl.content.cloneNode(true))
      bodyMain.appendChild(infoTpl.content.cloneNode(true))
      bodyMain.appendChild(guardiasTpl.content.cloneNode(true))    
    break;
  
  }

  infoTpl.remove(); mediaTpl.remove(); guardiasTpl.remove()

  const css = new CSSStyleSheet()

  // Colores
  css.insertRule(` :root { --app-color: ${CONF.interface.colors.app}; } `)
  css.insertRule(` :root { --main-color: ${CONF.interface.colors.main}; } `)
  css.insertRule(` :root { --main-color-light: ${shadeColor(CONF.interface.colors.main, 30)}; } `)
  css.insertRule(` :root { --main-color-dark: ${shadeColor(CONF.interface.colors.main, -30)}; } `)
  css.insertRule(` :root { --secondary-color: ${CONF.interface.colors.secondary}; } `)
  css.insertRule(` :root { --secondary-color-light: ${shadeColor(CONF.interface.colors.secondary, 30)}; } `)
  css.insertRule(` :root { --secondary-color-dark: ${shadeColor(CONF.interface.colors.secondary, -30)}; } `)
  css.insertRule(` :root { --transition-duration: ${CONF.media.transitionDuration}s } `)
  css.insertRule(` #guardias { background: url(file://${window.ipc.get.path('userData').replace(/\\/g,'/')}/_custom/guardiasBGImg.png) 0 0 no-repeat; background-size: 100% 100%} `)

  document.adoptedStyleSheets = [css]

  $('infoImg').src = `file://${window.ipc.get.path('userData')}/_custom/headerImg.png`



/*======================================================================
===========            CONTENIDO, SOCKET Y HORA            =============
======================================================================*/
  var content = new Content(CONF.deployDir, false, window.ipc.logger, {volume: 0, transition_duration: CONF.media.transitionDuration})
  content.next()

  var ws = new wSocket(CONF, content, window.ipc, true)
  ws.init()

  var guardias = new Guardias($('guardiasList'), $('fecha'), CONF.deployDir, window.ipc.logger, {refreshInterval:500,generateQr:CONF.guardias.geolocationQRs})
  
  updateTime($('hora'), 5000)





// Atajos de teclado para testeo
window.onkeyup = (e) => {
  switch (e.key) {
    case 'Enter':
      window.ipc.logger.std({origin: 'USER', event: 'SKIP_CONTENT', message: ''})
      content.next()
    break
    case 'p':
      content.togglePause()
    break
    case 'g':
      guardias.render()
    break
  }
}