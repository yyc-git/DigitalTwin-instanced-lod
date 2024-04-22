import { state } from "../../../../../type/StateType";
import { getAbstractState, getWarehouseSceneState, setAbstractState, setWarehouseSceneState } from "../../../../../state/State"
import { Device, Layer, NullableUtils } from "meta3d-jiehuo-abstract"
import { Billboard, Camera, Instance, Loader, Scene, ModelLoader, State, View, Octree } from "meta3d-jiehuo-abstract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { SceneUtils } from "meta3d-jiehuo-abstract"
import * as BuildRightSideCabinet from "./right_side/BuildCabinet"
import * as BuildLeftSideCabinet from "./left_side/BuildCabinet"
import * as BuildRail from "../BuildRail"
import * as BuildWarehouse from "./BuildWarehouse"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { getDefaultCameraType, getDynamicGroupName, getName, getState, getStaticGroupName, setState } from "../../WarehouseScene";
import { addLabelToCabinet } from "./BuildUtils";
import { addDirectionLight } from "../../Light";
import { getGirlState } from "../../Girl";
import { Vector3 } from "three";
import { setControlsConfig } from "./Camera";
import { findAllDrawers } from "../../manage/warehouse1/Cabinet1";

let _addGroups = (scene, [staticGroup, dynamicGroup]) => {
    scene.add(staticGroup, dynamicGroup)

    return scene
}

let _addCabinets = (state: state, scene,) => {
    let dynamicGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getDynamicGroupName()))

    dynamicGroup = ArrayUtils.range(1, 15).reduce((dynamicGroup, cabinetNumber) => {
        let cabinet = BuildRightSideCabinet.build(state, cabinetNumber)
        Layer.enableAllPickableLayer(cabinet)

        cabinet.translateX((BuildWarehouse.getWidth() - BuildRightSideCabinet.getWidth() - BuildWarehouse.getDistanceOfRightSideToRightWall() - BuildWarehouse.getThickness()) / 2)
        cabinet.translateY(BuildRightSideCabinet.getHeight() / 2)
        cabinet.translateZ((BuildWarehouse.getDepth() - BuildRightSideCabinet.getDepth()) / 2 - BuildWarehouse.getDistanceOfFirstToDoor())
        cabinet.rotateY(Math.PI)

        if (cabinetNumber == 2) {
            cabinet.translateZ(15)
        }
        else {
            cabinet.translateZ((cabinetNumber - 1) * 13)
        }

        dynamicGroup.add(cabinet)

        return dynamicGroup
    }, dynamicGroup)

    dynamicGroup = ArrayUtils.range(16, 43).reduce((dynamicGroup, i) => {
        let index = i - 15
        let cabinetNumber = 29 - index

        let cabinet = BuildLeftSideCabinet.build(state, cabinetNumber)
        // Layer.enableAllPickableLayer(cabinet)

        cabinet.translateX(-(BuildWarehouse.getWidth() - BuildLeftSideCabinet.getWidth() - BuildWarehouse.getDistanceOfLeftSideToLeftWall() - BuildWarehouse.getThickness()) / 2)
        cabinet.translateY(BuildRightSideCabinet.getHeight() / 2)
        cabinet.translateZ((BuildWarehouse.getDepth() - BuildLeftSideCabinet.getDepth()) / 2 - BuildWarehouse.getDistanceOfFirstToDoor())
        cabinet.rotateY(Math.PI)
        cabinet.translateZ((index - 1) * 7)

        dynamicGroup.add(cabinet)

        return dynamicGroup
    }, dynamicGroup)


    dynamicGroup = addLabelToCabinet(dynamicGroup)

    // return [state, scene]
    return scene
}

let _addRails = (scene, state: state) => {
    let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))


    let rightRailDepth = BuildWarehouse.getDepth() - BuildWarehouse.getDistanceOfFirstToDoor() - BuildWarehouse.getDistanceOfRightSideLastToDoor()

    let railRight1 = BuildRail.build(state, rightRailDepth)
    railRight1.position.setX(BuildWarehouse.getWidth() / 2 - BuildWarehouse.getDistanceOfRightSideToRightWall() + 5)
    let railRight2 = railRight1.clone()
    railRight2.translateX(-10)
    let railRight3 = railRight2.clone()
    railRight3.translateX(-10)
    let railRight4 = railRight3.clone()
    railRight4.translateX(-20)


    let leftRailDepth = BuildWarehouse.getDepth() - BuildWarehouse.getDistanceOfFirstToDoor() - BuildWarehouse.getDistanceOfLeftSideLastToDoor()

    let railLeft1 = BuildRail.build(state, leftRailDepth)
    railLeft1.position.setX(-(BuildWarehouse.getWidth() / 2 - BuildWarehouse.getDistanceOfLeftSideToLeftWall() - 5))
    let railLeft2 = railLeft1.clone()
    railLeft2.translateX(20)
    let railLeft3 = railLeft2.clone()
    railLeft3.translateX(20)



    staticGroup.add(railRight1, railRight2, railRight3, railRight4)
    staticGroup.add(railLeft1, railLeft2, railLeft3)

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
    // scene = _changeDirectionLight(scene, state)

    // let light = null
    // scene.traverse((object: any) => {
    //     if (object.isDirectionalLight) {
    //         light = object
    //     }
    // })

    // scene.remove(light)

    // let color = 0xFFFFFF
    // // let intensity = 2
    // let intensity = 200
    // light = NewThreeInstance.createPointLight(color, intensity, 1000, 0.8)
    // // light.position.set(10, 20, 8)
    // // light.position.set(0, 45, 20)
    // light.position.set(0, 45, -100)

    // let geometry = NewThreeInstance.createSphereGeometry(1, 12, 6);
    // let material = NewThreeInstance.createMeshBasicMaterial({ color: color });
    // material.color.multiplyScalar(intensity);
    // let sphere = NewThreeInstance.createMesh(geometry, material);
    // light.add(sphere);
    // scene.add(light)

    // if (getIsDebug(state)) {
    //     let helper = new DirectionalLightHelper(light);
    //     scene.add(helper);
    // }


    // let light
    // scene.traverse(object => {
    //     if (object.isDirectionalLight) {
    //         light = object
    //     }
    // })
    // scene.remove(light)

    let data = addDirectionLight(state, scene, renderer)
    state = data[0]
    scene = data[1]

    return [state, scene]
}

let _adjustGroupsForLightDirection = (state: state) => {
    let { staticGroup, dynamicGroup } = getState(state)

    staticGroup.rotateY(Math.PI)
    dynamicGroup.rotateY(Math.PI)

    // staticGroup.updateWorldMatrix(true, true)
    // dynamicGroup.updateWorldMatrix(true, true)


    // staticGroup.matrixWorldNeedsUpdate = true
    // dynamicGroup.matrixWorldNeedsUpdate = true

    return state
}

let _addInstances = (state: state, scene, dynamicGroup) => {
    // let data = Instance.convertLODToInstanceMeshLOD(getAbstractState(state), scene, findAllDrawers(dynamicGroup))
    // state = setAbstractState(state, data[0])
    // scene = data[1]

    let data = Instance.convertNotLODToInstanceMesh(getAbstractState(state), scene, findAllDrawers(dynamicGroup))
    state = setAbstractState(state, data[0])
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
            position: new Vector3(0, 0, 5)
        }
    })

    state = setControlsConfig(state)

    scene = _addGroups(scene, [staticGroup, dynamicGroup])

    let data

    scene = _addCabinets(state, scene)
    // state = data[0]
    // scene = data[1]

    scene = _addRails(scene, state)

    scene = _addWarehouse(scene, state)

    // Layer.enableAllToVisibleLayer(scene)

    state = _adjustGroupsForLightDirection(state)


    data = _addInstances(state, scene, dynamicGroup)
    state = data[0]
    scene = data[1]

    Scene.getScene(getAbstractState(state)).add(scene)

    return state

}