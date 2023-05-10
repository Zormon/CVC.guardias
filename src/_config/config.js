import {$, $$, tabNav, displayGroup, readFileAsDataURL} from '../exports.web.js'
var CONF = window.ipc.get.appConf()

async function saveConf() {
    CONF.deployDir = $('deployDir').value
    CONF.media.transitionDuration = $('transitionDuration').value
    CONF.logsDir = $('logsDir').value

    CONF.server.ip = $('serverIp').value != ''? $('serverIp').value : $('serverIp').placeholder
    CONF.server.port = $('serverPort').value != ''? parseInt($('serverPort').value) : parseInt($('serverPort').placeholder)

    CONF.window.type = parseInt($('windowType').value)
    CONF.window.width = $('windowSizeX').value != ''? parseInt($('windowSizeX').value) : parseInt($('windowSizeX').placeholder)
    CONF.window.height = $('windowSizeY').value != ''? parseInt($('windowSizeY').value) : parseInt($('windowSizeY').placeholder)
    CONF.window.posX = $('windowPosX').value != ''? parseInt($('windowPosX').value) : parseInt($('windowPosX').placeholder)
    CONF.window.posY = $('windowPosY').value != ''? parseInt($('windowPosY').value) : parseInt($('windowPosY').placeholder)
    CONF.window.alwaysOnTop = $('alwaysOnTop').checked

    CONF.interface.colors.app = $('appColor').value
    CONF.interface.colors.main = $('mainColor').value
    CONF.interface.colors.secondary = $('secondaryColor').value
    CONF.interface.type = parseInt($('interfaceType').value)
    CONF.interface.order = parseInt($('interfaceOrder').value)
    CONF.interface.guardias.BG.type = parseInt($('guardiasBGType').value)
    CONF.interface.guardias.BG.colors[0] = $('guardiasBGColor1').value
    CONF.interface.guardias.BG.colors[1] = $('guardiasBGColor2').value
    
    CONF.guardias.geolocationQRs = $('geolocationQRs').checked

    const reader = new FileReader()
    let files=[], file, dataUrl

    // Imagen cabecera
    file = $('headerImg').files[0]
    if (!!file) {
        dataUrl = await readFileAsDataURL(file)
        files.push( {name: '/img/headerImg.png', file: dataUrl.substring(22)} )
    }

    // Imagen fondo guardias
    file = $('guardiasBGImg').files[0]
    if (!!file) {
        dataUrl = await readFileAsDataURL(file)
        files.push( {name: '/img/guardiasBGImg.png', file: dataUrl.substring(22)} )
    }

    window.ipc.save.appConf( CONF, files )
}


/* *********************** EVENTS *****************  */
$('save').onclick = (e)=> {
    e.preventDefault()
    if ( $('config').checkValidity() )  { saveConf() }
    else                                { $('config').reportValidity()}
}

$('deployDirExplore').onclick = (e)=> {
    e.preventDefault()
    let dir = window.ipc.dialog.saveDir({dir: $('deployDir').value, file:'deploy.json'})
    $('deployDir').value = dir
}

$('logsDirExplore').onclick = (e)=> {
    e.preventDefault()
    let dir = window.ipc.dialog.saveDir({dir: $('logsDir').value, file:false})
    $('logsDir').value = dir
}


// On Changes
$('windowType').onchange = (e) => { displayGroup($('window'), e.currentTarget.value) }
$('interfaceType').onchange = (e) => { displayGroup($('turnos'), e.currentTarget.value) }
$('guardiasBGType').onchange = (e) => { displayGroup($('tab-guardias'), e.currentTarget.value) }
/* *********************** / EVENTS *****************  */


// Initialization
$('deployDir').value = CONF.deployDir
$('transitionDuration').value = CONF.media.transitionDuration
$('logsDir').value = CONF.logsDir
$('serverIp').value = CONF.server.ip
$('serverPort').value = CONF.server.port

$('windowType').value = CONF.window.type
$('windowSizeX').value = CONF.window.width
$('windowSizeY').value = CONF.window.height
$('windowPosX').value = CONF.window.posX
$('windowPosY').value = CONF.window.posY
$('alwaysOnTop').checked = CONF.window.alwaysOnTop

$('appColor').value = CONF.interface.colors.app
$('mainColor').value = CONF.interface.colors.main
$('secondaryColor').value = CONF.interface.colors.secondary
$('interfaceType').value = CONF.interface.type
$('interfaceOrder').value = CONF.interface.order
$('guardiasBGType').value = CONF.interface.guardias.BG.type
$('guardiasBGColor1').value = CONF.interface.guardias.BG.colors[0]
$('guardiasBGColor2').value = CONF.interface.guardias.BG.colors[1]
$('guardiasBGImg')

$('geolocationQRs').checked = CONF.guardias.geolocationQRs

// Events
const event = new Event('change')
$('windowType').dispatchEvent(event)
$('interfaceType').dispatchEvent(event)
$('guardiasBGType').dispatchEvent(event)

tabNav( $('configTabs'), $('configTabsContent'))