// import { SceneUtils } from 'meta3d-jiehuo-abstract';
import * as ParkScene from '../scene3d_layer/script/scene/scene_park/ParkScene';
import { cameraType } from '../scene3d_layer/type/StateType';

// export let getResourceId = sceneNumber => SceneUtils.buildResourceId(ParkScene.getName, sceneNumber)

export let loadResource = ParkScene.loadResource

export let getAllSceneIndices = ParkScene.getAllSceneIndices

export let useOrbitControls = ParkScene.useOrbitControls

export let useThirdPersonControls = ParkScene.useThirdPersonControls

export let getCameraType = (state) => {
    switch (ParkScene.getCameraType(state)) {
        case cameraType.ThirdPerson:
            return "第三人称相机"
        case cameraType.Orbit:
        default:
            return "轨道相机"
    }
}

export let getAllCameraTypes = () => ["轨道相机", "第三人称相机"]

export let getAllSceneNumbers = ParkScene.getAllSceneNumbers