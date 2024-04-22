// import { SceneUtils } from 'meta3d-jiehuo-abstract';
import * as WarehouseScene from '../scene3d_layer/script/scene/scene_warehouse/WarehouseScene';
import { cameraType } from '../scene3d_layer/type/StateType';

// export let getResourceId = sceneNumber => SceneUtils.buildResourceId(WarehouseScene.getName, sceneNumber)

export let loadResource = WarehouseScene.loadResource

export let getAllSceneIndices = WarehouseScene.getAllSceneIndices

export let playCabinetDrawerGoInArticluatedAnimation = WarehouseScene.playCabinetDrawerGoInArticluatedAnimation

export let useOrbitControls = WarehouseScene.useOrbitControls

export let useThirdPersonControls = WarehouseScene.useThirdPersonControls

export let getCameraType = (state) => {
    switch (WarehouseScene.getCameraType(state)) {
        case cameraType.ThirdPerson:
            return "第三人称相机"
        case cameraType.Orbit:
        default:
            return "轨道相机"
    }
}

export let getAllCameraTypes = () => ["轨道相机", "第三人称相机"]

export let exitOperateCabinetMode = WarehouseScene.exitOperateCabinetMode

export let getAllSceneNumbers = WarehouseScene.getAllSceneNumbers