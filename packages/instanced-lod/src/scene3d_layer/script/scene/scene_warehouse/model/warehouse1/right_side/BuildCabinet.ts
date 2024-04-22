import { state } from "../../../../../../type/StateType";
import * as BuildCabinetBody from "./BuildCabinetBody"
import * as BuildCabinetDrawer from "./BuildCabinetDrawer"
import * as BuildCabinetHandler from "../../BuildCabinetHandler"
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { Instance } from "meta3d-jiehuo-abstract";
// import {} from "../../../Cabinet";
import { NewThreeInstance } from "meta3d-jiehuo-abstract";
import { createCabinetMaterial, getCabinetColor, getCabinetMetalness, getCabinetRoughness } from "../../BuildCabinetUtils";
import { buildDrawerInstanceId, buildCabinetBodyName, buildDrawerName, getDrawer } from "../../../manage/warehouse1/Cabinet1";
import { buildCabinetName } from "../../../Cabinet";
import { Color, Material, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { AmbientLight } from "meta3d-jiehuo-abstract";

let _buildBlockDrawers = (cabinetDrawers, step, start, cabinetDrawer, cabinetNumber, blockNumber) => {
    let {
        gap_up,
        gap_middle,
        gap_right,
    } = BuildCabinetBody.getConfig()

    return ArrayUtils.range(start, start + step - 1).reduce((cabinetDrawers, i) => {
        let drawerNumber = i + 1

        let clonedOne = cabinetDrawer.clone(true)
        clonedOne.name = buildDrawerName(cabinetNumber, drawerNumber)

        clonedOne.position.set(
            (BuildCabinetBody.getWidth() - BuildCabinetDrawer.getWidth()) / 2 - gap_right
            - (blockNumber <= 4 ? ((blockNumber - 1) * (gap_middle + BuildCabinetDrawer.getWidth())) : ((blockNumber - 4 - 1) * (gap_middle + BuildCabinetDrawer.getWidth())))
            ,
            // (BuildCabinetBody.getHeight() - BuildCabinetDrawer.getHeight()) / 2 - gap_up - (blockNumber <= 4 ? 0 : (BuildCabinetBody.getBlockHeigth() + BuildCabinetDrawer.getHeight()))
            (BuildCabinetBody.getHeight() - BuildCabinetDrawer.getHeight()) / 2 - gap_up - 0.5 - (blockNumber <= 4 ? 0 : (BuildCabinetBody.getBlockHeigth() + BuildCabinetDrawer.getHeight()))
            ,
            (BuildCabinetBody.getDepth() - BuildCabinetDrawer.getDepth()) / 2
        )

        clonedOne.translateY((drawerNumber - step - start) * BuildCabinetDrawer.getHeight())


        clonedOne = Instance.addInstanceIdPostfixToObject(clonedOne, buildDrawerInstanceId(cabinetNumber, drawerNumber))


        cabinetDrawers.push(clonedOne)

        return cabinetDrawers
    }, cabinetDrawers)
}

export let getHeight = () => BuildCabinetBody.getHeight()

export let getWidth = () => BuildCabinetBody.getWidth()

export let getDepth = () => BuildCabinetBody.getDepth()

export let build = (state: state, cabinetNumber: number) => {
    let bodyMaterial = createCabinetMaterial()


    let cabinetBody = BuildCabinetBody.build(state, bodyMaterial)
    cabinetBody.name = buildCabinetBodyName(cabinetNumber)

    let cabinetDrawer = getDrawer(state)


    let cabinetHandler = BuildCabinetHandler.build(state)
    cabinetHandler.translateX(BuildCabinetBody.getWidth() / 2 + BuildCabinetHandler.getConfig().cicleBottomHeight / 2)
    cabinetHandler.translateY(-BuildCabinetBody.getHeight() * 0.3)
    cabinetHandler.rotateY(Math.PI / 2)


    let cabinet = NewThreeInstance.createObject3D()
    cabinet.name = buildCabinetName(cabinetNumber)

    let cabinetDrawers = []

    let step = 10

    cabinetDrawers = _buildBlockDrawers(cabinetDrawers, step, 0, cabinetDrawer, cabinetNumber, 1)
    cabinetDrawers = _buildBlockDrawers(cabinetDrawers, step, 10, cabinetDrawer, cabinetNumber, 2)
    cabinetDrawers = _buildBlockDrawers(cabinetDrawers, step, 20, cabinetDrawer, cabinetNumber, 3)
    cabinetDrawers = _buildBlockDrawers(cabinetDrawers, step, 30, cabinetDrawer, cabinetNumber, 4)
    cabinetDrawers = _buildBlockDrawers(cabinetDrawers, step, 40, cabinetDrawer, cabinetNumber, 5)
    cabinetDrawers = _buildBlockDrawers(cabinetDrawers, step, 50, cabinetDrawer, cabinetNumber, 6)
    cabinetDrawers = _buildBlockDrawers(cabinetDrawers, step, 60, cabinetDrawer, cabinetNumber, 7)
    cabinetDrawers = _buildBlockDrawers(cabinetDrawers, step, 70, cabinetDrawer, cabinetNumber, 8)





    cabinet.add(...cabinetDrawers)
    cabinet.add(cabinetBody, cabinetHandler)


    return cabinet
}