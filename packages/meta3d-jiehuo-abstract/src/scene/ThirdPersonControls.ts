import { Vector3, Object3D, Euler } from "three"
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { state, thirdPersonControls } from "../type/StateType"
import { Map } from "immutable"
import { getExn, isNullable, return_ } from "../utils/NullableUtils"
import { getSceneState, setSceneState } from "../state/State"
import { getKeyDownEventName, getKeyUpEventName, on, off } from "../Event"
import { getCurrentCamera, getOrbitControls } from "./Camera"
import { isMobile } from "../Device"
import * as nipplejs from 'nipplejs'

export let createDefaultKeyState = () => Map({
    "KeyW": false,
    "KeyA": false,
    "KeyS": false,
    "KeyD": false,
})

export let createState = (): thirdPersonControls => {
    return {
        keyState: createDefaultKeyState(),
        joystickManager: null,
        moveHandlerFunc: null,
        endHandlerFunc: null,
        forward: 0,
        back: 0,
        left: 0,
        right: 0
    }
}

export let _getState = (state: state) => {
    return getSceneState(state).camera.thirdPersonControls
}

export let _setState = (state: state, thirdPersonControlsState) => {
    return setSceneState(state, {
        ...getSceneState(state),
        camera: {
            ...getSceneState(state).camera,
            thirdPersonControls: thirdPersonControlsState
        }
    })
}

export let _getKeyState = (state: state) => {
    return getSceneState(state).camera.thirdPersonControls.keyState
}

export let _setKeyState = (state: state, keyState) => {
    return _setState(state, {
        ..._getState(state),
        keyState: keyState
    })
}

export let _resetKey = (state: state) => {
    return _setState(state, {
        ..._getState(state),
        keyState: createDefaultKeyState()
    })
}

let _isAllowCode = (keyState, code: string) => {
    return keyState.has(code)
}

let _bindEvent = (state: state, [getAbstractStateFunc, setAbstractStateFunc]) => {
    if (!isMobile()) {
        state = on(state, getKeyDownEventName(), (specficState, { userData }) => {
            let event = getExn(userData)

            let state = getAbstractStateFunc(specficState)

            if (_isAllowCode(_getKeyState(state), event.code)) {
                state = _resetKey(state)

                state = _setKeyState(state, _getKeyState(state).set(event.code, true))
            }

            specficState = setAbstractStateFunc(specficState, state)

            return Promise.resolve(specficState)
        })
        state = on(state, getKeyUpEventName(), (specficState, { userData }) => {
            let event = getExn(userData)

            let state = getAbstractStateFunc(specficState)

            if (_isAllowCode(_getKeyState(state), event.code)) {
                state = _setKeyState(state, _getKeyState(state).set(event.code, false))
            }

            specficState = setAbstractStateFunc(specficState, state)

            return Promise.resolve(specficState)
        })
    }

    return state
}


export let init = (state: state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc]) => {
    state = _bindEvent(state, [getAbstractStateFunc, setAbstractStateFunc])

    if (isMobile()) {
        state = _setState(state, {
            ..._getState(state),
            joystickManager: return_(nipplejs.create({
                zone: _getZoneDom(),
                size: getSize(),
                multitouch: true,
                maxNumberOfNipples: 2,
                mode: 'static',
                restJoystick: true,
                shape: 'circle',
                position: { top: '50%', right: '50%' },
                dynamicPage: true,
            }))
        })

        state = _bindJoystickEvent(state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc])
    }

    return Promise.resolve(state)
}

let _bindJoystickEvent = (state: state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc]) => {
    let joystickManager = getExn(_getState(state).joystickManager)

    let moveHandlerFunc = function (evt, data) {
        let specificState = readSpecificStateFunc()
        let state = getAbstractStateFunc(specificState)

        let forward = data.vector.y
        let turn = data.vector.x

        let fwdValue = 0
        let bkdValue = 0
        let lftValue = 0
        let rgtValue = 0

        if (forward > 0) {
            fwdValue = Math.abs(forward)
            bkdValue = 0
        } else if (forward < 0) {
            fwdValue = 0
            bkdValue = Math.abs(forward)
        }

        if (turn > 0) {
            lftValue = 0
            rgtValue = Math.abs(turn)
        } else if (turn < 0) {
            lftValue = Math.abs(turn)
            rgtValue = 0
        }

        writeSpecificStateFunc(setAbstractStateFunc(specificState, _setState(state, {
            ..._getState(state),
            forward: fwdValue,
            back: bkdValue,
            left: lftValue,
            right: rgtValue,
        })))
    }

    let endHandlerFunc = function (evt) {
        let specificState = readSpecificStateFunc()
        let state = getAbstractStateFunc(specificState)

        writeSpecificStateFunc(setAbstractStateFunc(
            specificState, _setState(state, {
                ..._getState(state),
                forward: 0,
                back: 0,
                left: 0,
                right: 0,
            })))
    }

    joystickManager.on("move", moveHandlerFunc)
    joystickManager.on("end", endHandlerFunc)

    return _setState(state, {
        ..._getState(state),
        moveHandlerFunc: return_(moveHandlerFunc),
        endHandlerFunc: return_(endHandlerFunc)
    })
}

// let getSize = () => "3rem"
export let getSize = () => 100

// let _createAndInsertZoneDom = () => {
//     let div = document.createElement("div")
//     div.id = "meta3d_joystick_zone"
//     // div.style.width = getSize()
//     // div.style.height = getSize()
//     div.style.width = `${getSize()}px`
//     div.style.height = `${getSize()}px`
//     div.style.position = "absolute"
//     div.style.top = "30%"
//     div.style.left = "5%"
//     div.style.zIndex = "2"

//     // document.body.appendChild(div)
//     document.body.append(div)
// }

let _getZoneDom = () => {
    return document.querySelector<HTMLElement>("#meta3d_joystick_zone")
}

let _showZoneDom = () => {
    _getZoneDom().style.display = "block"
}

let _hideZoneDom = () => {
    _getZoneDom().style.display = "none"
}

let _isUsed = () => {
    return _getZoneDom().style.display == "block"
}

// let _removeZoneDom = () => {
//     document.querySelector("#meta3d_joystick_zone")?.remove()
// }


// export let initWhenUse = (state: state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc]) => {
export let initWhenUse = (state: state) => {
    if (isMobile()) {
        // _createAndInsertZoneDom()
        _showZoneDom()

        // state = _setState(state, {
        //     ..._getState(state),
        //     joystickManager: return_(nipplejs.create({
        //         zone: _getZoneDom(),
        //         size: getSize(),
        //         multitouch: true,
        //         maxNumberOfNipples: 2,
        //         mode: 'static',
        //         restJoystick: true,
        //         shape: 'circle',
        //         position: { top: '50%', right: '50%' },
        //         dynamicPage: true,
        //     }))
        // })

        // state = _bindJoystickEvent(state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc])
    }

    return state
}

export let isMoveFront = (state: state) => {
    if (isMobile()) {
        return _getState(state).forward > 0
    }

    return getExn(_getKeyState(state).get('KeyW'))
}

export let isMoveBack = (state: state) => {
    if (isMobile()) {
        return _getState(state).back > 0
    }

    return getExn(_getKeyState(state).get('KeyS'))
}

export let isMoveLeft = (state: state) => {
    if (isMobile()) {
        return _getState(state).left > 0
    }

    return getExn(_getKeyState(state).get('KeyA'))
}

export let isMoveRight = (state: state) => {
    if (isMobile()) {
        return _getState(state).right > 0
    }

    return getExn(_getKeyState(state).get('KeyD'))
}

let _setTarget = (orbitControls: OrbitControls, target: Vector3) => {
    orbitControls.target = target
}

export let initControls = (state: state, orbitControls: OrbitControls, camera, orbitControlsTarget, { position }, isDebug) => {
    camera.position.copy(position)

    _setTarget(orbitControls, orbitControlsTarget)

    orbitControls.object = camera

    orbitControls.minDistance = 1
    orbitControls.maxDistance = 100

    if (isDebug) {
        orbitControls.maxPolarAngle = Math.PI
    }
    else {
        orbitControls.maxPolarAngle = Math.PI / 2
        // orbitControls.maxPolarAngle = Math.PI
    }

    if (isMobile()) {
        orbitControls.enableZoom = false
        orbitControls.enablePan = false
    }
    else {
        state = _setKeyState(state, createDefaultKeyState())
    }

    return state
}

export let updateCamera = (state: state, velocity: Vector3, orbitControlsTarget: Vector3) => {
    getCurrentCamera(state).position.add(velocity)
    _setTarget(getOrbitControls(state), orbitControlsTarget)
}

export let computeTransformForCamera = (state: state, girl, orbitControls, delta: number): [Euler, Vector3] => {
    let forward = 0
    let side = 0

    if (isMobile()) {
        let thirdPersonControlsState = _getState(state)

        forward = thirdPersonControlsState.forward > 0 ? thirdPersonControlsState.forward : -thirdPersonControlsState.back
        side = thirdPersonControlsState.right > 0 ? thirdPersonControlsState.right : -thirdPersonControlsState.left
    }
    else {
        let keyState = _getKeyState(state)

        let data = keyState.reduce(([forward, side], isPress, key) => {
            if (isPress) {
                switch (key) {
                    case "KeyW":
                        forward += 1
                        break
                    case "KeyA":
                        side -= 1
                        break
                    case "KeyD":
                        side += 1
                        break
                    case "KeyS":
                        forward -= 1
                        break
                }
            }

            return [forward, side]
        }, [0, 0])
        forward = data[0]
        side = data[1]
    }

    let controlRotationAngle = orbitControls.getAzimuthalAngle()

    let playRotateRelativeToCamera
    if (forward < 0) {
        playRotateRelativeToCamera = (Math.PI * side) / 2
    }
    else {
        if (side > 0) {
            playRotateRelativeToCamera = Math.PI / 2 + (1 - side) * (Math.PI / 2)
        }
        else {
            playRotateRelativeToCamera = -Math.PI / 2 - (1 + side) * (Math.PI / 2)
        }
    }


    if (forward == -1 && side == 1) {
        playRotateRelativeToCamera = Math.PI / 4
    }
    else if (forward == -1 && side == -1) {
        playRotateRelativeToCamera = - Math.PI / 4
    }
    else if (forward == 1 && side == 1) {
        playRotateRelativeToCamera = Math.PI * 3 / 4
    }
    else if (forward == 1 && side == -1) {
        playRotateRelativeToCamera = - Math.PI * 3 / 4
    }

    // playRotateRelativeToCamera /=  (forward && side ? 2 : 1)

    let localRotation = new Euler().copy(girl.rotation)

    if (forward !== 0 || side !== 0) {
        localRotation.y = controlRotationAngle + playRotateRelativeToCamera
    }


    let velocity = new Vector3(0, 0, 0)

    let speed = delta * 4 + 1

    if (forward) {
        velocity.z -= speed * forward
    }

    if (side) {
        velocity.x += speed * side
    }


    // 旋转位移向量
    velocity.applyAxisAngle(Object3D.DEFAULT_UP, controlRotationAngle)

    return [localRotation, velocity]
}


export let dispose = (state: state) => {
    if (isMobile()) {
        // if (!isNullable(_getState(state).joystickManager)) {
        //     // getExn(_getState(state).joystickManager).destroy()
        //     let joystickManager = getExn(_getState(state).joystickManager)
        //     joystickManager.off("move", getExn(_getState(state).moveHandlerFunc))
        //     joystickManager.off("end", getExn(_getState(state).endHandlerFunc))
        //     // _removeZoneDom()
        //     _hideZoneDom()
        //     // state = _setState(state, {
        //     //     ..._getState(state),
        //     //     joystickManager: null
        //     // })
        // }
        // getExn(_getState(state).joystickManager).destroy()
        if (_isUsed()) {
            // let joystickManager = getExn(_getState(state).joystickManager)
            // joystickManager.off("move", getExn(_getState(state).moveHandlerFunc))
            // joystickManager.off("end", getExn(_getState(state).endHandlerFunc))
            
            _hideZoneDom()
        }

    }

    return state
}