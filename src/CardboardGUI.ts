import { html, MOValue } from "sam-lib"
import { CardboardWAM } from "./CardboardWAM"
import { ParamView } from "./utils/ParamView"
import { BooleanField, NumberField } from "./CardboardField"

import stylesheet from "./cardboard.css?url"

const UUID = "aa"//randomUUID().toString()

export class CardboardGUI extends HTMLElement{

    static NAME = `card-cardboard${UUID}`
    static RESOLUTION = 30
    
    #paramview: ParamView
    wave: Array<MOValue<number>>
    attack: Array<MOValue<number>>
    release: Array<MOValue<number>>
    sustain: Array<MOValue<number>>
    interpolate: MOValue<number>
    attack_duration: MOValue<number>
    release_duration: MOValue<number>
    sustain_duration: MOValue<number>
    sustain_loop: MOValue<number>

    #observers: (()=>void)[] = []

    #root

    constructor(public wam: CardboardWAM){
        super()
        this.#root=this.attachShadow({mode:"closed"})
        
        this.#paramview = new ParamView(wam.audioNode)
        this.wave = Array.from({length:CardboardGUI.RESOLUTION},(_,i)=>this.#paramview.addParameter(`curve${i}`))
        this.attack = Array.from({length:CardboardGUI.RESOLUTION},(_,i)=>this.#paramview.addParameter(`attack${i}`))
        this.release = Array.from({length:CardboardGUI.RESOLUTION},(_,i)=>this.#paramview.addParameter(`release${i}`))
        this.sustain = Array.from({length:CardboardGUI.RESOLUTION},(_,i)=>this.#paramview.addParameter(`sustain${i}`))
        this.interpolate = this.#paramview.addParameter("interpolate")
        this.attack_duration = this.#paramview.addParameter("attack_duration")
        this.release_duration = this.#paramview.addParameter("release_duration")
        this.sustain_duration = this.#paramview.addParameter("sustain_duration")
        this.sustain_loop = this.#paramview.addParameter("sustain_loop")
    }

    selectedMenu = "wave"

    connectedCallback(){
        this.#observers.forEach(o=>o())
        this.#observers = []
        const gui = this
        let content: DocumentFragment


        // Content
        if(this.selectedMenu=="wave"){
            const curve = new Curve(
                -1,1, 0, true,
                null,
                [],
                this.wave
            )
    
            const interpolate = new BooleanField(this.interpolate, "Interpolate curve points", "interpolate")
    
            content = html`
                ${curve.element}
                <div id="options">
                    ${interpolate.element}
                </div>
            `
    
            this.#observers.push(()=>curve.dispose(), ()=>interpolate.dispose())
        }
        else if(this.selectedMenu=="attack"){
            const curve = new Curve(
                0,1, 0, false,
                {name:"Attack Duration", unit:"seconds", min:0, max:5, step:0.1, value:gui.attack_duration},
                [],
                this.attack
            )

    
            content = html`
                ${curve.element}
            `
    
            this.#observers.push(()=>curve.dispose())
        }
        else if(this.selectedMenu=="sustain"){
            const curve = new Curve(
                0,1, 0, false,
                {name:"Sustain Duration", unit:"seconds", min:0, max:10, step:0.1, value:gui.sustain_duration},
                [],
                this.sustain
            )

            const loopInput = new BooleanField(this.sustain_loop, "Loop Sustain Curve", "sustain_loop")

            content = html`
                ${curve.element}
                <div id="options">
                    ${loopInput.element}
                </div>
            `
    
            this.#observers.push(()=>curve.dispose(), ()=>loopInput.dispose())
        }
        else if(this.selectedMenu=="release"){
            const curve = new Curve(
                0,1, 0, false,
                {name:"Release Duration", unit:"seconds", min:0, max:5, step:0.1, value:gui.release_duration},
                [],
                this.release
            )

    
            content = html`
                ${curve.element}
            `
    
            this.#observers.push(()=>curve.dispose())
        }

        // Create Page
        function onMenuChange(event:Event){
            gui.selectedMenu = (event.target as HTMLElement).id.replace("_menu","")
            gui.connectedCallback()
        }
        this.#root.replaceChildren(html`
            <link rel="stylesheet" crossorigin href="${stylesheet}" />
            <h1>Cardboardizer</h1>
            <ul class="menu">
                <li id=wave_menu @${{click:onMenuChange}}>Wave</li>
                <li id=attack_menu @${{click:onMenuChange}}>Attack</li>
                <li id=sustain_menu @${{click:onMenuChange}}>Sustain</li>
                <li id=release_menu @${{click:onMenuChange}}>Release</li>
            </ul>
            ${content}
            <div class=crayon></div>
        `)
        this.#root.querySelector(`#${this.selectedMenu}_menu`).classList.add("selected")
    }
    
    disconnectedCallback(){
    
    }

    dispose(){
        this.#paramview.dispose()
        this.#observers.forEach(o=>o())
    }
}


try{
    customElements.define(CardboardGUI.NAME,CardboardGUI)
}catch(e){}


class Curve{
    
    element: HTMLElement

    diposables: (()=>void)[] = []

    static COLORS = ["red","blue","green","yellow","purple","magenta","cyan","orange","pink","brown"]

    constructor(
        min_value: number,
        max_value: number,
        center_value: number,
        doLoop: boolean,

        variable: {
            name: string,
            min: number,
            max: number,
            step: number,
            unit?: string,
            value: MOValue<number>
        }|null,

        separators: {name:string, index:number}[],
        values: Array<MOValue<number>>,
    ){
        const resolution = values.length
        const { diposables } = this
        const span_value = max_value-min_value

        const circles = [] as SVGCircleElement[]
        
        const center_height = Math.round(100-(center_value-min_value)/span_value*100)
        this.element = html.a`
            <div class=curve>
                <svg viewBox="0 0 200 100">
                    <text x=0 y=7 fill=white style="font-size: .5rem">${max_value}</text>
                    <text x=0 y=97 fill=white style="font-size: .5rem">${min_value}</text>
                    <line x1=0 y1=${center_height} x2=200 y2=${center_height} stroke=white stroke-width=1 />
                    ${function*(){
                        let i=0
                        for(const {name,index} of separators){
                            const x = (index)/resolution*200
                            const color = Curve.COLORS[i%Curve.COLORS.length]
                            yield html`<svg><text x=${x+2} y=80 fill=${color} style="font-size: .5rem">${name}</text></svg>`
                            yield html`<svg><line x1=${x} y1=0 x2=${x} y2=100 stroke=${color} stroke-width=1 /></svg>`
                            i++
                        }
                    }}
                    ${function*(){
                        const sep = 200/resolution
                        const start = doLoop?-1:0
                        const end = doLoop?resolution:resolution-1
                        for(let i=start; i<end; i++){
                            const f = (i+resolution)%resolution
                            const t = (f+1)%resolution
                            const from = values[f]
                            const to = values[t]
                            const line = html.a`<svg><line stroke=black stroke-width=1 /></svg>`.children[0] as SVGLineElement
                            line.x1.baseVal.value = (i+0.5)*sep
                            line.x2.baseVal.value = (i+1.5)*sep
                            const update = ()=>{
                                line.y1.baseVal.value = 100-(from.value-min_value)/span_value*100
                                line.y2.baseVal.value = 100-(to.value-min_value)/span_value*100
                            }
                            diposables.push(from.observable.add(update))
                            diposables.push(to.observable.add(update))
                            update()
                            yield line
                        }
                        for(let i=0; i<resolution; i++){
                            const val = values[i]
                            const circle = html.a`<svg><circle r=1.5 stroke=white stroke-width=1 fill=black /></svg>`.children[0] as SVGCircleElement
                            circle.cx.baseVal.value = (i+0.5)*sep
                            diposables.push(val.link(({to})=>{
                                circle.cy.baseVal.value = 100-(val.value-min_value)/span_value*100
                            }))
                            circles.push(circle)
                            yield circle
                        }
                    }}
                </svg>
                ${()=>{
                    if(!variable)return undefined
                    else{
                        const element=html.a`
                            <div>
                                <input type="range" min=${variable.min} max=${variable.max} step=${variable.step} />
                                <label for="curve_length">${variable.name}</label>
                            </div>
                        `
                        const label = element.children[1] as HTMLLabelElement
                        const input = element.children[0] as HTMLInputElement
                        variable.value.link(({to})=>{
                            input.value = to.toString()
                            label.textContent = `${variable.name} (${to}${variable.unit?` ${variable.unit}`:""})`
                        })
                        input.addEventListener("input", ()=>variable.value.set(parseFloat(input.value)))
                        return element
                    }
                }}
                
            </div>
        `

        // Draw curve
        const curve = this.element.children[0]
        const ondraw = (e:MouseEvent)=>{
            const x = Math.round(e.offsetX/curve.clientWidth*resolution)
            const y = Math.max(min_value,Math.min(max_value, (curve.clientHeight-e.offsetY)/curve.clientHeight*span_value+min_value))
            if(x<0||x>=resolution)return
            circles.forEach(it=>it.r.baseVal.value = 1.5)
            circles[x].r.baseVal.value = 3
            const val = values[x]
            if(e.buttons==1) val.set(y)
        }
        curve.addEventListener("mousemove", ondraw)
        curve.addEventListener("mousedown", ondraw)
        curve.addEventListener("mouseleave",()=>{
            circles.forEach(it=>it.r.baseVal.value = 1.5)
        })
    }

    dispose(){
        this.diposables.forEach(d=>d())
    }
}