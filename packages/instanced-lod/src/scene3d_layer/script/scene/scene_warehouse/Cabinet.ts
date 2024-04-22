import { Scene } from "meta3d-jiehuo-abstract"

export let getOriginName = () => "cabinet"

export let getBodyOriginName = () => "body"

export let buildCabinetName = (cabinetNumber: number) => {
    return `${getOriginName()}_${cabinetNumber}`
}

export let getCabinetNumber = (cabinetName: string) => {
    return Number(cabinetName.replace(`${getOriginName()}_`, ""))
}

export let findAllBodys = (scene) => {
    return Scene.findObjects(scene, ({ name }) => name.includes(getBodyOriginName()))
}

export let isCabinet = (name) => {
    return name.includes(getOriginName())
}

export let findOriginCabinet = (scene) => {
    return Scene.findObjectByName(scene, getOriginName())
}

export let findAllCabinets = (scene) => {
    return Scene.findObjects(scene, ({ name }) => isCabinet(name))
}
