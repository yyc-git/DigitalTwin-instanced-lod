import { state } from "../../../../../type/StateType";
import { getAbstractState, getWarehouseSceneState, setAbstractState, setWarehouseSceneState } from "../../../../../state/State"
import { Device, Layer, NullableUtils } from "meta3d-jiehuo-abstract"
import { Billboard, Camera, Instance, Loader, Scene, ModelLoader, State, View, Octree } from "meta3d-jiehuo-abstract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { SceneUtils } from "meta3d-jiehuo-abstract"
import * as BuildCabinet from "./BuildCabinet"
import * as BuildWarehouse from "./BuildWarehouse"
import * as BuildRail from "../BuildRail"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { getDefaultCameraType, getDynamicGroupName, getName, getState, getStaticGroupName, setState } from "../../WarehouseScene";
import { addDirectionLight } from "../../Light";
import { addLabelToCabinet } from "../warehouse1/BuildUtils";
import { getGirlState } from "../../Girl";
import { Vector3 } from "three";
import { setControlsConfig } from "./Camera";

let _addGroups = (scene, [staticGroup, dynamicGroup]) => {
    scene.add(staticGroup, dynamicGroup)

    return scene
}

let _addCabinets = (state: state, scene,) => {
    let dynamicGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getDynamicGroupName()))

    dynamicGroup = ArrayUtils.range(1, 29).reduce((dynamicGroup, i) => {
        let index = i
        let cabinetNumber = 30 - index

        let cabinet = BuildCabinet.build(state, cabinetNumber)
        Layer.enableAllPickableLayer(cabinet)

        cabinet.translateY(BuildCabinet.getHeight() / 2)
        cabinet.translateX(-(BuildWarehouse.getWidth() - BuildCabinet.getWidth() - BuildWarehouse.getThickness()) / 2)
        cabinet.translateZ((BuildWarehouse.getDepth() - BuildCabinet.getDepth()) / 2 - BuildWarehouse.getDistanceOfFirstToDoor())
        cabinet.translateZ(-(index - 1) * 8)

        dynamicGroup.add(cabinet)

        return dynamicGroup
    }, dynamicGroup)

    dynamicGroup = addLabelToCabinet(dynamicGroup)

    return [state, scene]
}

let _addRails = (scene, state: state) => {
    let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

    let railDepth = BuildWarehouse.getDepth() - BuildWarehouse.getDistanceOfFirstToDoor()

    let rail1 = BuildRail.build(state, railDepth)
    rail1.position.setX(-(BuildWarehouse.getWidth() / 2 - 5))
    let rail2 = rail1.clone()
    rail2.translateX(10)

    staticGroup.add(rail1, rail2)

    return scene
}

let _addWarehouse = (scene, state: state) => {
    let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

    let warehouse = BuildWarehouse.build(state)
    staticGroup.add(warehouse)

    return scene
}

let _addLight = (state: state, scene, renderer) => {
    scene = SceneUtils.addAmbientLight(scene)

    let data = addDirectionLight(state, scene, renderer)
    state = data[0]
    scene = data[1]

    return [state, scene]
}

export let build = (state: state, renderer) => {
    let staticGroup = Scene.createGroup(getStaticGroupName())
    let dynamicGroup = Scene.createGroup(getDynamicGroupName())

    let scene = Scene.createScene(getName())

    state = setState(state, {
        ...getState(state),
        staticGroup: NullableUtils.return_(staticGroup),
        dynamicGroup: NullableUtils.return_(dynamicGroup),
        scene: NullableUtils.return_(scene),
        girl: {
            ...getGirlState(state),
            position: new Vector3(25, 0, 5)
        }
    })

    state = setControlsConfig(state)

    scene = _addGroups(scene, [staticGroup, dynamicGroup])

    let data = _addCabinets(state, scene)
    state = data[0]
    scene = data[1]

    scene = _addRails(scene, state)

    scene = _addWarehouse(scene, state)
    // data = _addLight(state, scene, renderer)
    // state = data[0]
    // scene = data[1]

    Scene.getScene(getAbstractState(state)).add(scene)

    return state

}