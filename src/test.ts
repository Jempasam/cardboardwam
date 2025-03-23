import { initializeWamHost } from "@webaudiomodules/sdk"
import { CardboardWAM } from "./CardboardWAM"
import { WebAudioModule } from "@webaudiomodules/api"
import { html } from "sam-lib"

const wams = [] as WebAudioModule[]

const body = document.querySelector('body')

const pedalboard = html.a`<div class="pedalboard"></div>`
body.appendChild(pedalboard)

document.onclick = async() => {
    document.onclick = null

    const ctx = new AudioContext()
    const [groupId] = await initializeWamHost(ctx)

    // WAM
    const wam = await CardboardWAM.createInstance(groupId,ctx)
    wams.push(wam)
    pedalboard.appendChild(await wam.createGui())


    // Visualizer
    async function load(url: string){
        const factory = (await import(url)).default as typeof WebAudioModule
        const visualizer = await factory.createInstance(groupId, ctx)
        wams.push(visualizer)
        pedalboard.appendChild(html`<div>${await visualizer.createGui()}</div>`)	
        return visualizer
    }

    const keyboard = await load("https://mainline.i3s.unice.fr/wam2/packages/simpleMidiKeyboard/index.js")
    const piano = await load("https://www.webaudiomodules.com/community/plugins/burns-audio/pianoroll/index.js")
    const oscilloscope = await load("https://www.webaudiomodules.com/community/plugins/wimmics/SRVisualizers/dist/oscilloscope/index.js")
    const spectrogram = await load("https://www.webaudiomodules.com/community/plugins/wimmics/SRVisualizers/dist/spectrogram/index.js")
    
    keyboard.audioNode.connect(wam.audioNode)
    keyboard.audioNode.connectEvents(wam.instanceId)

    piano.audioNode.connect(wam.audioNode)
    piano.audioNode.connectEvents(wam.instanceId)

    wam.audioNode.connect(oscilloscope.audioNode)
    wam.audioNode.connect(spectrogram.audioNode)
    wam.audioNode.connect(ctx.destination)


    // Menu
    const menu = html.a`
    <div class="menu">
        <button @${{click:()=>{
            piano.audioNode.scheduleEvents({
                time: 0,
                type: "wam-transport",
                data: {
                    playing: true,
                    currentBar: 0,
                    currentBarStarted: wam.audioContext.currentTime,
                    tempo: 120,
                    timeSigDenominator: 4,
                    timeSigNumerator: 4,
                }
            })
        }}}>Play</button>
        <button @${{click:()=>{
            piano.audioNode.scheduleEvents({
                type: "wam-transport",
                data: {
                    playing: false,
                    currentBar: 0,
                    currentBarStarted: wam.audioContext.currentTime,
                    tempo: 120,
                    timeSigDenominator: 4,
                    timeSigNumerator: 4,
                }
            })
        }}}>Pause</button>
        <button @${{click:async()=>{
            const states = await Promise.all(wams.map(wam=>wam.audioNode.getState()))
            localStorage.setItem("wamstates", JSON.stringify(states))
        }}}>Save</button>
        <button @${{click:()=>{
            const states = JSON.parse(localStorage.getItem("wamstates"))
            wams.forEach((wam,i)=>wam.audioNode.setState(states[i]))
        }}}>Load</button>
        <button>Clear</button>
    </div>
    `
    body.firstElementChild.before(menu)

}
//document.onclick()

console.log('click to play')