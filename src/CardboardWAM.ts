import { WamNode, WebAudioModule } from "@webaudiomodules/sdk"
import { CardboardAudioNode } from "./CardboardAudioNode"
import { CardboardGUI } from "./CardboardGUI"

export class CardboardWAM extends WebAudioModule {

    async initialize(state?: any): Promise<WebAudioModule> {
        this._descriptorUrl = import.meta.resolve('./descriptor.json')
        await this._loadDescriptor()
        await super.initialize(state)
        return this
    }

    async createAudioNode(initialState?: any): Promise<CardboardAudioNode> {
        await CardboardAudioNode.addModules(this.audioContext, this.moduleId)
        const node = new CardboardAudioNode(this)
        await node._initialize()
        if(initialState) node.setState(initialState)
        return node
    }

    async createGui(): Promise<Element> {
        return new CardboardGUI(this)
    }
}

export default CardboardWAM