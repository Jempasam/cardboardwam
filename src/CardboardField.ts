import { html, MOValue } from "sam-lib"

export class NumberField{

    element
    dispose

    constructor(
        value: MOValue<number>,
        id: string, label: string,
        min: number, max: number, step: number
    ){
        this.element = html.a`
            <div>
                <label for="${id}">${label}</label>
                <input type="number" id="${id}" min="${min}" max="${max}" step="${step}" />
            </div>
        `
        const input = this.element.children[1] as HTMLInputElement
        this.dispose = value.link(({to})=>input.value = to.toString())
        input.addEventListener("input", ()=> value.set(parseFloat(input.value)) )
    }
}

export class BooleanField{

    element
    dispose

    constructor(
        value: MOValue<number>,
        id: string, label: string,
    ){
        this.element = html.a`
            <div>
                <label for="${id}">${label}</label>
                <input type="checkbox" id="${id}" />
            </div>
        `
        const input = this.element.children[1] as HTMLInputElement
        this.dispose = value.link(({to})=>input.checked = to>.5)
        input.addEventListener("input", ()=> value.set(input.checked?1:0) )
    }
}