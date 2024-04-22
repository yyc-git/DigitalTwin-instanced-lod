import { state } from "../../../../../../type/StateType";
import * as BuildCabinetGrid from "./BuildCabinetGrid"
import * as BuildCabinetBody from "./BuildCabinetBody"
import * as BuildCabinetHandler from "../../BuildCabinetHandler"
// import { ArrayUtils } from "meta3d-jiehuo-abstract";
// import { Instance } from "meta3d-jiehuo-abstract";
// import { getOriginName, getDrawerOriginName, buildDrawerInstanceId, buildCabinetName, buildCabinetBodyName } from "../../../Cabinet";
import { NewThreeInstance } from "meta3d-jiehuo-abstract";
import { createCabinetMaterial } from "../../BuildCabinetUtils";
import { buildCabinetBodyName } from "../../../manage/warehouse1/Cabinet2";
import { buildCabinetName } from "../../../Cabinet";

// let _buildDrawerName = (cabinetNumber: number, drawerNumber: number) => {
//     return `${getDrawerOriginName()}_${cabinetNumber}_${drawerNumber}`
// }

// let _buildBlockDrawers = (cabinetDrawers, step, start, cabinetDrawer, cabinetNumber, blockNumber) => {
//     let {
//         gap_up,
//         gap_middle,
//         gap_right,
//     } = BuildCabinetBody.getConfig()

//     return ArrayUtils.range(start, start + step - 1).reduce((cabinetDrawers, i) => {
//         let drawerNumber = i + 1

//         let clonedOne = cabinetDrawer.clone(true)
//         clonedOne.name = _buildDrawerName(cabinetNumber, drawerNumber)

//         clonedOne.position.set(
//             (BuildCabinetBody.getWidth() - BuildCabinetDrawer.getWidth()) / 2 - gap_right
//             - (blockNumber <= 4 ? ((blockNumber - 1) * (gap_middle + BuildCabinetDrawer.getWidth())) : ((blockNumber - 4 - 1) * (gap_middle + BuildCabinetDrawer.getWidth())))
//             ,
//             (BuildCabinetBody.getHeight() - BuildCabinetDrawer.getHeight()) / 2 - gap_up - (blockNumber <= 4 ? 0 : (BuildCabinetBody.getBlockHeigth() + BuildCabinetDrawer.getHeight()))
//             ,
//             (BuildCabinetBody.getDepth() - BuildCabinetDrawer.getDepth()) / 2)

//         clonedOne.translateY((drawerNumber - step - start) * BuildCabinetDrawer.getHeight())


//         clonedOne = Instance.addInstanceIdPostfixToObject(clonedOne, buildDrawerInstanceId(cabinetNumber, drawerNumber))


//         cabinetDrawers.push(clonedOne)

//         return cabinetDrawers
//     }, cabinetDrawers)
// }

export let getHeight = () => BuildCabinetBody.getHeight()

export let getWidth = () => BuildCabinetBody.getWidth()

export let getDepth = () => BuildCabinetBody.getDepth()

export let build = (state: state, cabinetNumber: number) => {
    let material = createCabinetMaterial()

    let cabinetBody = BuildCabinetBody.build(state, material)
    cabinetBody.name = buildCabinetBodyName(cabinetNumber)

    // let cabinetGrid = BuildCabinetGrid.build(20,20)
    let cabinetGrid = BuildCabinetGrid.build()
    cabinetGrid.rotateX(Math.PI / 2)
    // cabinetGrid.translateY((BuildCabinetBody.getDepth() - BuildCabinetBody.getHoleFrontDepth()) / 2)
    cabinetGrid.translateY(-BuildCabinetBody.getDepth() / 2 + BuildCabinetBody.getHoleBackDepth())

    let cabinetHandler = BuildCabinetHandler.build(state)
    cabinetHandler.translateX(-(BuildCabinetBody.getWidth() / 2 + BuildCabinetHandler.getConfig().cicleBottomHeight / 2))
    cabinetHandler.translateY(-BuildCabinetBody.getHeight() * 0.3)
    cabinetHandler.rotateY(Math.PI / 2 + Math.PI)


    let cabinet = NewThreeInstance.createObject3D()
    cabinet.name = buildCabinetName(cabinetNumber)


    cabinet.add(cabinetBody, cabinetGrid, cabinetHandler)
    // cabinet.add(cabinetBody, cabinetGrid)


    return cabinet
}