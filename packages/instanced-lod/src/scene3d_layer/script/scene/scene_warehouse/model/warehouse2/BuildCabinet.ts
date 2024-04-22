import { Color } from "three"
import { state } from "../../../../../type/StateType"
import * as BuildCabinetBody from "./BuildCabinetBody"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
// import { buildCabinetBodyName, buildCabinetName } from "../../Cabinet"
import * as BuildCabinetHandler from "../BuildCabinetHandler"
import { createCabinetMaterial } from "../BuildCabinetUtils"
import { buildCabinetBodyName } from "../../manage/warehouse2/Cabinet3"
import { buildCabinetName } from "../../Cabinet"

export let getWidth = BuildCabinetBody.getWidth

export let getHeight = BuildCabinetBody.getHeight

export let getDepth = BuildCabinetBody.getDepth

export let build = (state: state, cabinetNumber: number) => {
    let material = createCabinetMaterial()

    let cabinet = NewThreeInstance.createObject3D()
    cabinet.name = buildCabinetName(cabinetNumber)

    let body = BuildCabinetBody.build(state, material)
    body.name = buildCabinetBodyName(cabinetNumber)


    let cabinetHandler = BuildCabinetHandler.build(state)
    cabinetHandler.translateX((BuildCabinetBody.getWidth() / 2 + BuildCabinetHandler.getConfig().cicleBottomHeight / 2))
    cabinetHandler.translateY(-BuildCabinetBody.getHeight() * 0.3)
    cabinetHandler.rotateY(Math.PI / 2)



    cabinet.add(body, cabinetHandler)

    return cabinet
}