import { AudioWorkletGlobalScope, WamParameterInfoMap } from "@webaudiomodules/api";
import type { WamProcessor as WP } from "@webaudiomodules/sdk";
import type { WamParameterInfo as PI, WamEvent, WamMidiData, WamTransportData } from "@webaudiomodules/api";
import { addFunctionModule, getWamParameter, getWamParameterInterpolator, WamNode } from "@webaudiomodules/sdk";
import { CardboardWAM } from "./CardboardWAM";


export class CardboardAudioNode extends WamNode{

    constructor(module: CardboardWAM){
        super(module,{
            channelCount: 2,
            numberOfOutputs: 1,
        })
    }

    static async addModules(audioContext: BaseAudioContext, moduleId: string){
        await super.addModules(audioContext, moduleId)
        await addFunctionModule(audioContext.audioWorklet, getWamParameterInterpolator, moduleId);
        await addFunctionModule(audioContext.audioWorklet, getCardboardAudioProcessor, moduleId)
    }

    parameters: AudioParamMap;


}

function getCardboardAudioProcessor(moduleId: string) {

    const audioWorklet = globalThis as any as AudioWorkletGlobalScope

    const ModuleScope = audioWorklet.webAudioModules.getModuleScope(moduleId)

    const WamProcessor = ModuleScope.WamProcessor as typeof WP
    const WamParameterInfo = ModuleScope.WamParameterInfo as typeof PI

    const RESOLUTION = 30

    const PERIODS = Array.from({length:256}, (_,note)=>{
        const frequency = Math.pow(2,(note-69)/12)*440
        const period = 1/frequency
        return period
    })

    const STEP_ATTACK = 1
    const STEP_SUSTAIN = 2
    const STEP_RELEASE = 3
    interface CurrentNote{
        advancement: number,
        last_start: number,
        period: number,
        multiplier: number,
        step: number,
        doStop?: true
    }

    function sample(array: Float32Array<ArrayBufferLike>[], i: number, fpos: number, doLoop:boolean, doInterpolate: boolean){
        let pos, pos2
        if(doLoop){
            const ipos = Math.floor(fpos*array.length)
            pos = (ipos+array.length)%array.length
            pos2 = (pos+1)%array.length
        }
        else{
            const ipos = Math.floor(fpos*array.length)
            pos = Math.min(ipos, array.length-1)
            pos2 = Math.min(pos+1, array.length-1)
        }
        if(doInterpolate){
            const strength = fpos*array.length-Math.floor(fpos*array.length)
            return array[pos][i]*(1-strength) + array[pos2][i]*strength
        }
        else return array[pos][i]
    }

    class CardboardAudioProcessor extends WamProcessor {

        notes: Record<number, CurrentNote> = {}

        _process(startSample: number, endSample: number, inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): void {
            const CURVE = Array.from({length:RESOLUTION},(_,i)=>this._parameterInterpolators[`curve${i}`].values)
            
            const ATTACK = Array.from({length:RESOLUTION},(_,i)=>this._parameterInterpolators[`attack${i}`].values)
            const attackDuration = this._parameterInterpolators["attack_duration"].values

            const SUSTAIN = Array.from({length:RESOLUTION},(_,i)=>this._parameterInterpolators[`sustain${i}`].values)
            const sustainDuration = this._parameterInterpolators["sustain_duration"].values
            const doSustainLoop = this._parameterInterpolators["sustain_loop"].values

            const RELEASE = Array.from({length:RESOLUTION},(_,i)=>this._parameterInterpolators[`release${i}`].values)
            const releaseDuration = this._parameterInterpolators["release_duration"].values

            const doInterpolate = this._parameterInterpolators["interpolate"].values
            for(const note in this.notes){
                const note_state = this.notes[note]
                for(let i = startSample; i<endSample; i++){
                    const sample_time = note_state.advancement + (i-startSample)/audioWorklet.sampleRate
                    const period = note_state.period

                    let wave = sample(CURVE, i, sample_time/period, true, doInterpolate[i]>.5)
                    
                    let intensity = 0
                    const time = sample_time - note_state.last_start
                    let stop = false
                    switch(note_state.step){
                        case STEP_ATTACK:{
                            intensity = sample(ATTACK, i, time/attackDuration[i], false, true)
                            if(time>attackDuration[i]){
                                note_state.step = STEP_SUSTAIN
                                note_state.last_start = sample_time
                                note_state.multiplier *= intensity
                            }
                            break
                        }
                        case STEP_SUSTAIN:{
                            const doLoop = doSustainLoop[i]>.5
                            intensity = sample(SUSTAIN, i, time/sustainDuration[i], doLoop, true)
                            if(!doLoop && time>sustainDuration[i]){
                                note_state.step = STEP_RELEASE
                                note_state.last_start = sample_time
                                note_state.multiplier *= intensity
                            }
                            if(note_state.doStop){
                                note_state.step = STEP_RELEASE
                                note_state.last_start = sample_time
                                note_state.multiplier *= intensity
                            }
                            break
                        }
                        case STEP_RELEASE:{
                            intensity = sample(RELEASE, i, time/releaseDuration[i], false, true)
                            if(time>releaseDuration[i]){
                                stop = true
                            }
                            break
                        }
                    }
                    if(stop){
                        delete this.notes[note]
                        break
                    }
                    outputs[0][0][i] += wave * intensity * note_state.multiplier
                }
                note_state.advancement += (endSample-startSample)/audioWorklet.sampleRate
            }
        }

        _processEvent(event: WamEvent): void {
            super._processEvent(event)
        }

        _onMidi(midiData: WamMidiData): void {
            const type = midiData.bytes[0] & 0xf0
            const note = midiData.bytes[1]
            const velocity = midiData.bytes[2]
            if(type==0x80 || (type==0x90 && velocity==0)){
                if(this.notes[note])this.notes[note].doStop = true
            }
            else if(type==0x90 && velocity>0){
                this.notes[note] = {advancement:0, last_start: 0, period: PERIODS[note], multiplier: 1, step: STEP_ATTACK}
            }
        }

        _generateWamParameterInfo(): WamParameterInfoMap {
            const ret = {} as WamParameterInfoMap
            for(let i=0; i<RESOLUTION; i++){
                const defaultValue = Math.sin(i/RESOLUTION*Math.PI*2)
                ret[`curve${i}`] = new WamParameterInfo(`curve${i}`,{
                    type: "float",
                    label: `Curve Point ${i+1}`,
                    minValue: -1, maxValue: 1, defaultValue
                })
            }

            for(let i=0; i<RESOLUTION; i++){
                const defaultValue = Math.max(0,Math.sin(i/RESOLUTION*Math.PI*.5))
                ret[`attack${i}`] = new WamParameterInfo(`attack${i}`,{
                    type: "float",
                    label: `Attack Curve Point ${i+1}`,
                    minValue: 0, maxValue: 1, defaultValue
                })
            }
            ret["attack_duration"] = new WamParameterInfo("attack_duration",{
                type: "float",
                label: "Attack Curve Duration",
                minValue: 0, maxValue: 5, defaultValue: 1,
                units: "s",
            })

            for(let i=0; i<RESOLUTION; i++){
                ret[`sustain${i}`] = new WamParameterInfo(`sustain${i}`,{
                    type: "float",
                    label: `Sustain Curve Point ${i+1}`,
                    minValue: 0, maxValue: 1, defaultValue: 1
                })
            }
            ret["sustain_duration"] = new WamParameterInfo("sustain_duration",{
                type: "float",
                label: "Sustain Curve Duration",
                minValue: 0, maxValue: 5, defaultValue: 1,
                units: "s",
            })
            ret["sustain_loop"] = new WamParameterInfo("sustain_loop",{
                type: "boolean",
                label: "Do Sustain Curve loop?",
                defaultValue: 1,
            })

            for(let i=0; i<RESOLUTION; i++){
                const defaultValue = Math.max(0,Math.sin((i/RESOLUTION+1.)*Math.PI*.5))
                ret[`release${i}`] = new WamParameterInfo(`release${i}`,{
                    type: "float",
                    label: `Release Curve Point ${i+1}`,
                    minValue: 0, maxValue: 1, defaultValue
                })
            }
            ret["release_duration"] = new WamParameterInfo("release_duration",{
                type: "float",
                label: "Release Curve Duration",
                minValue: 0, maxValue: 5, defaultValue: 1,
                units: "s",
            })

            ret["interpolate"] = new WamParameterInfo("interpolate",{
                type: "boolean",
                label: "Interpolate",
                defaultValue: 1
            })
            return ret
        }

    }

    
    try{ audioWorklet.registerProcessor(moduleId, CardboardAudioProcessor) }catch(e){}
    
}