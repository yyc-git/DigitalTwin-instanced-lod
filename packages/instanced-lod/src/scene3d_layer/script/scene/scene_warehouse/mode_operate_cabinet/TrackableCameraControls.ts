import { NewThreeInstance, View, Camera } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
import { getAbstractState } from "../../../../state/State"
import { setToCurrentCamera } from "../WarehouseScene"
import { Object3D, Vector3 } from "three"

export let createOrthoCamera = () => {
    let frustumSize = 30
    let aspect = View.getWidth() / View.getHeight()
    let far = 100
    let near = 0.01

    let camera = NewThreeInstance.createOrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, near, far)

    return camera
}

let _initControls = (controls: TrackballControls, camera, target: Vector3) => {
    camera.position.set(target.x, target.y + 11, target.z + 20)
    // camera.position.setZ(target)

    // controls.rotateSpeed = 1.0
    // controls.zoomSpeed = 1.2
    // controls.panSpeed = 10
    controls.noRotate = true
    controls.noZoom = true
    controls.noPan = true
    controls.staticMoving = true

    controls.object = camera

    controls.target = target
}

export let use = (state: state, target: Object3D) => {
    let controls = Camera.getTrackballControls(getAbstractState(state))

    state = setToCurrentCamera(state, createOrthoCamera(), controls)

    _initControls(
        controls,
        Camera.getCurrentCamera(getAbstractState(state)),
        target.getWorldPosition(new Vector3())
    )

    return state
}