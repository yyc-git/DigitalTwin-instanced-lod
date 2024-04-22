import { Camera, Layer, NullableUtils, ThirdPersonControls, View } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../type/StateType"
import { getDefaultCameraType, getState, setState } from "./WarehouseScene"
import { PerspectiveCamera, Vector3 } from "three"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../state/State"
import { getGirl } from "./Girl"
import { getIsDebug } from "../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"

export let createPerspectiveCamera = () => {
    // let camera = NewThreeInstance.createPerspectiveCamera(60, View.getWidth() / View.getHeight(), 0.1, 1000)
    let camera = NewThreeInstance.createPerspectiveCamera(60, View.getWidth() / View.getHeight(), 1, 1000)

    // Layer.enableVisibleLayer(camera.layers)

    return camera
}

// export let getCamera = (state: state) => {
//     return NullableUtils.getExn(getState(state).camera)
// }

export let getOrbitControlsTarget = (girl) => {
    return new Vector3(0, 10, 0).add(girl.position)
}

let _initThirdPersonControlsWhenUse = (state: state, controls, camera, girl, isDebug) => {
    let abstractState = ThirdPersonControls.initControls(getAbstractState(state), controls, camera, getOrbitControlsTarget(girl), NullableUtils.getExn(getState(state).thirdPersonControlsConfig), isDebug)
    abstractState = ThirdPersonControls.initWhenUse(abstractState)

    return setAbstractState(state, abstractState)
}

let _initOribitControls = (controls, camera, { position, target }) => {
    camera.position.copy(position)

    controls.object = camera

    controls.target = target

    controls.minDistance = 1
    controls.maxDistance = 150

    controls.maxPolarAngle = Math.PI / 2
    // controls.maxPolarAngle = Math.PI 

    controls.enableZoom = true
    controls.enablePan = true
}

export let useOrbitControls = (state: state) => {
    state = setState(state, {
        ...getState(state),
        cameraType: cameraType.Orbit
    })

    _initOribitControls(Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), NullableUtils.getExn(getState(state).orbitControlsConfig))

    return state
}

export let useThirdPersonControls = (state: state) => {
    state = setState(state, {
        ...getState(state),
        cameraType: cameraType.ThirdPerson
    })

    state = _initThirdPersonControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getGirl(state), getIsDebug(state))

    return state

}

export let disposeThirdPersonControls = (state: state) => {
    return setAbstractState(state, ThirdPersonControls.dispose(getAbstractState(state)))
}

export let dispose = (state: state) => {
    state = disposeThirdPersonControls(state)

    state = setState(state, {
        ...getState(state),
        cameraType: getDefaultCameraType(),
    })

    return state
}