import {iconNames, $, $$, may, modalBox} from '../exports.web.js'

class wSocket {
    constructor(CONF, content, ipc, pan=false) {
        this.ip = CONF.server.ip
        this.port = CONF.server.port
        this.content = content

        this.userData = ipc.get.path('userData')
        this.shellExec = ipc.sys.shellExec
        this.log = ipc.logger.std
        this.logError = ipc.logger.error

        this.pan = pan
    }

    init() {
        this.ws =  new WebSocket(`ws://${this.ip}:${this.port}`)
        var _this = this
        _this.check()

        this.ws.onmessage = (message) => {
            let msg = JSON.parse(message.data)
            switch (msg.accion) {
                case 'event':
                    if (msg.event.devices.length === 0 || msg.event.devices.indexOf(this.content.deviceID) != -1) { // Si el evento es para todo o este equipo
                        switch (msg.event.type) {
                            case 'media':
                                if ( this.content.eventMedia(`${this.content.dir}/media/${msg.event.data.file}`, msg.event.data.duration, msg.event.data.volume)  ) {
                                    this.log({origin: 'NODESERVER', event: 'MEDIA_EVENT', message: `Archivo: ${msg.event.data.file}, Duracion: ${msg.event.data.duration}`})
                                } else {
                                    this.logError({origin: 'NODESERVER', error: 'MEDIA_EVENT_CANT_PLAY', message: `Evento recibido pero no se pudo reproducir ${msg.event.data.file}`})
                                }
                            break
                            case 'command':
                                this.shellExec(msg.event.data.shell)
                                this.log({origin: 'NODESERVER', event: 'COMMAND_EVENT', message: `Comando: ${msg.event.data.cmd}`})
                            break
                        }
                    }
                break
                default:
                    modalBox('OFFLINE', false)
                    _this.check()
                break
            }
        }
    }
	
	close() { this.ws.close() }

    check() {
        clearTimeout(document.wsTimeout)
      
        var _this = this
        document.wsTimeout = setTimeout( ()=> {
			_this.close()
            _this.init()
            _this.check()

            modalBox('OFFLINE', 'msgBox', [['header','ERROR DE CONEXIÓN'],['texto',`Conectando a ${this.ip}`]], 'error', false )
            this.logError({origin: 'NODESERVER', error: 'OFFLINE', message: `Conectando a ${this.ip}`})
            
        }, 5000)
      }
}

export default wSocket