import { QRCode } from '../res/qrim.js';
import {$, $$, urlExists} from '../exports.web.js'

class Guardias {
    constructor(targetUl, turnoEl, dir, logger, options) {
        options = {refreshInterval:60, generateQr:true, ...options}

        this.ul = targetUl
        this.turnoEl = turnoEl
        this.dir = dir
        this.log = logger.std
        this.logError = logger.error

        this.guardias = null
        this.turno = null

        this.options = options

        
        this.render()
        setInterval(() => {
            this.render()
        }, this.options.refreshInterval*1000);
    }

    async updateList() {
        return fetch(`file://${this.dir}/deploy.json`).then(r => r.json()).then((data) => {
            let now = new Date
            now.setTime(now.getTime() - 9 *60*60*1000) // Restar 9 horas porque las guardias son de 9AM a 9PM
            const day = now.getDate().toString().padStart(2,'0')
            const month = (now.getMonth()+1).toString().padStart(2,'0')
            const year = now.getFullYear().toString()
            const todayStr = `${year}-${month}-${day}`
            this.turno = `${day}/${month}/${year}`

            const guardiasHoy = data.guardias.days[todayStr]
            this.guardias = guardiasHoy?? null

            this.log({origin: 'GUARDIAS', event: 'UPDATE_LIST', message: `Zone: ${data.guardias.zone}, LastUpdated: ${data.guardias.lastUpdated}`})
        })
    }


    async render() {
        await this.updateList()
        const el = this.ul; while (el.firstChild) { el.removeChild(el.lastChild) }

        if (!!!this.guardias) {
            // Sin guardias
            let li = document.createElement('li')
            li.innerHTML = `<span class="name">No hay guardias</span>`
            li.classList.add('no-guardias')
            this.ul.appendChild(li)
            this.ul.dataset.count = 0

            return
        } 

        for (const [i,item] of this.guardias.entries()) {
            let typeText
            switch (item.type) {
                case 'normal':
                    typeText = '24 horas'
                    break;
                case 'refuerzo':
                    typeText = 'Hasta 22h'
                    break;
            }

            let li = document.createElement('li')
            li.innerHTML = `
                <div class="nameBlock"><span class="name">${item.name}</span></div>
                <div class="addressBlock">
                    <span class="address">${item.address}</span>
                    <div class="qr" id="qr${i}"></div>
                </div>
                <hr>
                <div class="detailsBlock">
                    <span class="phone">${item.phone.substr(0,3)} ${item.phone.substr(3,3)} ${item.phone.substr(6,3)}</span>
                    <span class="type">${typeText}</span>
                </div>`
            li.classList.add(item.type)
            
            this.ul.appendChild(li)
            
            if (this.options.generateQr && this.guardias.length <= 6) {
                const div = $('qr'+i)
                new QRCode(div, {
                    text: `https://maps.google.com/maps?q=${item.geo_x},${item.geo_y}`,
                    border: 0,
                    padding:0,
                    size:256
                },)
            }

            this.ul.dataset.count = this.guardias.length
        }

        this.turnoEl.innerHTML = this.turno
    }

}

export default Guardias