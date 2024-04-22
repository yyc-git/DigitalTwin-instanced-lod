import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import * as Scene from "../scene3d_layer/script/scene/Scene"
import { readState } from "./State"

export let switchScene = Scene.switchScene

export let setIsDebug = Scene.setIsDebug

export let getIsProduction = () => {
    return Scene.getIsProduction(readState())
}

export let setIsProduction = Scene.setIsProduction

export let getCurrentCameraType = Scene.getCurrentCameraType

export let getThirdPersonControlsJoystickZoneDomSize=  ThirdPersonControls.getSize