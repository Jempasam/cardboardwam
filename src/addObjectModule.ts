
/**
 * Send a stringifiable object (class, functions, values, ...) to the audio worklet.
 * Useful for small utilities class or functions.
 * @param audioWorklet 
 * @param processorFunction 
 * @param injection 
 * @returns 
 */
export async function addObjectModule(
    audioWorklet: AudioWorklet|AudioContext|AudioNode,
    moduleId: string,
    name: string,
    processorFunction: any,
    dependencies: string[]
) {
    let worklet: AudioWorklet
    if(audioWorklet instanceof AudioNode) worklet = audioWorklet.context.audioWorklet
    else if(audioWorklet instanceof AudioContext) worklet = audioWorklet.audioWorklet
    else worklet = audioWorklet 

    const text = `;(()=>{
        const audioWorklet = this
        const ModuleScope = audioWorklet.webAudioModules.getModuleScope(${moduleId})
        ${dependencies.map(it=>`const ${it} = ModuleScope.${it}`).join('\n')}
        ModuleScope.${name} = ${processorFunction.toString()}
    })()`
    const url = URL.createObjectURL(new Blob([text], { type: 'text/javascript' }))
    await worklet.addModule(url)
}
