import { Camera } from "meta3d-jiehuo-abstract"
import { Object3D, Sprite, Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { findLabel, getScene, getState, setCurrentMode, setState } from "../WarehouseScene"
import { mode, operateCabinetMode } from "../type/StateType"
import { use } from "./TrackableCameraControls"
import { findAllCabinets } from "../Cabinet"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { Render } from "meta3d-jiehuo-abstract"
import { getLight, updateShadow } from "../Light"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { Pick } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getEnterOperateCabinetModeEventName } from "../../../../utils/EventUtils"
import { Map } from "immutable"
import { findAllWallsAndDoors } from "../model/BuildWarehouseUtils"
import { isDrawer, judgeAndPlayDrawerGoOutArticluatedAnimation } from "../manage/warehouse1/Cabinet1"
import { setIsAlwaysShow } from "meta3d-jiehuo-abstract/src/ui_2d/Billboard"
import { Instance } from "meta3d-jiehuo-abstract"
import { disableAllPickableLayer, enableAllPickableLayer } from "meta3d-jiehuo-abstract/src/Layer"

export let createState = (): operateCabinetMode => {
    return {
        originScaleOfOtherCabinets: Map(),
        labelOriginScale: null,
        labelOriginPosition: null,
        targetCabinet: null,
        lastCamera: null,
        lastCameraControls: null,
        lastShadowBias: null
    }
}

let _storeCurrentState = (state: state, cabinet) => {
    // let originScaleOfOtherCabinets = findAllCabinets(getScene(state)).reduce((originScaleOfOtherCabinets, cabinet_) => {
    //     return originScaleOfOtherCabinets.set(cabinet_.name, cabinet_.scale.clone())
    // }, getState(state).operateCabinetMode.originScaleOfOtherCabinets)

    let label = findLabel(cabinet)

    return setState(state, {
        ...getState(state),
        operateCabinetMode: {
            ...getState(state).operateCabinetMode,
            // originScaleOfOtherCabinets,
            labelOriginScale: NullableUtils.return_(label.scale.clone()),
            labelOriginPosition: NullableUtils.return_(label.position.clone()),
            targetCabinet: NullableUtils.return_(cabinet),
            lastCamera: Camera.getCurrentCamera(getAbstractState(state)),
            lastCameraControls: NullableUtils.return_(Camera.getCurrentControls(getAbstractState(state))),
            // lastShadowBias: NullableUtils.return_(getLight(state).shadow.bias)
        }
    })
}

let _hiddenOtherCabinetsAndWallAndDoor = (state: state, cabinet: Object3D) => {
    // state = hideGirl(state)

    let abstractState = findAllCabinets(getScene(state)).reduce((abstractState, cabinet_) => {
        if (!Object3DUtils.isEqualByName(cabinet_, cabinet)) {
            abstractState = Object3DUtils.markAllVisibilty(abstractState, cabinet_, false)

            disableAllPickableLayer(cabinet_)

            return abstractState
        }

        return abstractState
    }, getAbstractState(state))

    state = setAbstractState(state, abstractState)

    findAllWallsAndDoors(state).forEach(obj => {
        obj.visible = false
    })

    return state
}

let _showOtherCabinetsAndWallAndDoor = (state: state) => {
    // // state = showGirl(state, false)

    // let originScaleOfOtherCabinets = getState(state).operateCabinetMode.originScaleOfOtherCabinets

    // findAllCabinets(getScene(state)).forEach(cabinet => {
    //     // cabinet.visible = false

    //     // cabinet.scale.copy(NullableUtils.getExn(originScaleOfOtherCabinets.get(cabinet.name)))
    //     // cabinet.matrixWorldNeedsUpdate = true

    //     findAllInstancedMeshsOfCabinet(cabinet, state).forEach(instance => {
    //         instance.visible = true
    //     })
    // })

    // findAllWallsAndDoors(state).forEach(obj => {
    //     obj.visible = true
    // })


    // return state


    let abstractState = findAllCabinets(getScene(state)).reduce((abstractState, cabinet) => {
        abstractState = Object3DUtils.markAllVisibilty(abstractState, cabinet, true)

        enableAllPickableLayer(cabinet)

        return abstractState
    }, getAbstractState(state))

    state = setAbstractState(state, abstractState)

    findAllWallsAndDoors(state).forEach(obj => {
        obj.visible = true
    })

    return state
}

let _pickEventHandler = (state: state, { userData }) => {
    let targets = NullableUtils.getExn(userData).targets

    if (targets.count() == 0) {
        return Promise.resolve(state)
    }

    let selectedMesh = NullableUtils.getExn(targets.get(0)).object

    if (isDrawer(selectedMesh)) {
        state = judgeAndPlayDrawerGoOutArticluatedAnimation(state, selectedMesh)
    }

    return Promise.resolve(state)
}

let _updateLabel = (state: state, cabinet: Object3D) => {
    let label = findLabel(cabinet)

    label.scale.multiplyScalar(0.5)
    label.position.sub(new Vector3(0, 8, 0))
    // label = Object3DUtils.markNeedsUpdate<Sprite>(label)

    label = setIsAlwaysShow(label, true)

    return state
}

let _restoreLabel = (state: state) => {
    let { labelOriginScale, labelOriginPosition, targetCabinet } = getState(state).operateCabinetMode

    let label = findLabel(NullableUtils.getExn(targetCabinet))

    label.scale.copy(NullableUtils.getExn(labelOriginScale))
    label.position.copy(NullableUtils.getExn(labelOriginPosition))
    // label = Object3DUtils.markNeedsUpdate<Sprite>(label)

    label = setIsAlwaysShow(label, false)

    return state
}

let _restoreCamera = (state: state) => {
    let { lastCamera, lastCameraControls } = getState(state).operateCabinetMode

    let abstractState = Camera.setCurrentCamera(getAbstractState(state), NullableUtils.getExn(lastCamera))
    abstractState = Camera.setCurrentControls(abstractState, NullableUtils.getExn(lastCameraControls))

    return setAbstractState(state, abstractState)
    // return useCurrentCamera(state)
}

let _updateShadow = (state: state) => {
    // Render.getRenderer(getAbstractState(state)).shadowMap.enabled = false
    getLight(state).shadow.bias = 1
    state = updateShadow(state)

    return state
}

let _restoreShadow = (state: state) => {
    // Render.getRenderer(getAbstractState(state)).shadowMap.enabled = true
    let { lastShadowBias } = getState(state).operateCabinetMode
    getLight(state).shadow.bias = NullableUtils.getExn(lastShadowBias)
    state = updateShadow(state)

    return state
}

export let enterMode = (state: state, cabinet: Object3D) => {
    state = setCurrentMode(state, mode.OpearteCabinet)
    state = _storeCurrentState(state, cabinet)
    state = _hiddenOtherCabinetsAndWallAndDoor(state, cabinet)
    // state = _updateShadow(state)
    state = _updateLabel(state, cabinet)

    // TODO fix: why affect by OrbitControls's zoom?
    state = use(state, cabinet)

    state = setAbstractState(state, Event.on(getAbstractState(state), Pick.getPickEventName(), _pickEventHandler))

    return Event.trigger<state>(state, getAbstractState, getEnterOperateCabinetModeEventName(), null)
}

export let exitMode = (state: state) => {
    state = setCurrentMode(state, mode.Default)
    state = _showOtherCabinetsAndWallAndDoor(state)
    // state = _restoreShadow(state)
    state = _restoreCamera(state)
    state = _restoreLabel(state)
    state = setAbstractState(state, Event.off(getAbstractState(state), Pick.getPickEventName(), _pickEventHandler))
    // state = stopArticluatedAnimationName(state)

    // state = setState(state, {
    //     ...getState(state),
    //     operateCabinetMode: {
    //         ...getState(state).operateCabinetMode,
    //         originScaleOfOtherCabinets: Map()
    //     }
    // })

    return state
}

export let dispose = (state: state) => {
    state = setAbstractState(state, Event.off(getAbstractState(state), Pick.getPickEventName(), _pickEventHandler))
    // state = stopArticluatedAnimationName(state)

    state = setState(state, {
        ...getState(state),
        operateCabinetMode: {
            ...getState(state).operateCabinetMode,
            originScaleOfOtherCabinets: Map()
        }
    })

    return state
}
