import { WamNode, WamParameterInfo, WamParameterInfoMap } from "@webaudiomodules/api"
import { MOValue, OValue } from "sam-lib"


export class ParamView{

    disposed: boolean = false

    private value_map: Record<string, MOValue<number>> = {} 

    constructor(private node: WamNode){
        const view = this
        const {value_map} = this

        setTimeout(async function timeout(){
            const values = await node.getParameterValues()

            for(const [id,movalue] of Object.entries(view.value_map)){
                const paramvalue = values[id]
                if(movalue.value!=paramvalue.value) movalue.value = paramvalue.value
            }

            if(!view.disposed)setTimeout(timeout,100)
        },100)
    }

    addParameter(id: string): MOValue<number>{
        const movalue = new MOValue<number>(0.0)
        const setter = movalue.set
        const {node} = this
        movalue.set = function(value: number){
            setter.call(this,value)
            node.setParameterValues({[id]:{id,normalized:false,value}})
        }
        this.value_map[id] = movalue
        return movalue
    }

    dispose(){
        this.disposed = true
    }
}
