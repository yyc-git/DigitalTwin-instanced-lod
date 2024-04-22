import { getPickState, getRenderState, setPickState } from "./state/State";
import { pick, state } from "./type/StateType";
import { bind, getExn, getWithDefault, isNullable, map, return_ } from "./utils/NullableUtils";
import { Vector2, Raycaster } from "three"
import { getCurrentCamera } from "./scene/Camera";
import { findObjectByName, getCurrentScene } from "./scene/Scene";
import { getDoubleClickEventName, getPageData, getPointerDownEventName, getPointerTapEventName, getSingleClickEventName, on, trigger } from "./Event";
import { List } from "immutable"
import { setPickableLayer } from "./Layer";
import { getHeight, getWidth } from "./View";
import { Device } from "./Main";

// let _onPointerDown = (event) => {
//     // if (event.isPrimary === false) {
//     //     return
//     // }

//     let x = (event.clientX / window.innerWidth) * 2 - 1;
//     let y = - (event.clientY / window.innerHeight) * 2 + 1;

//     globalThis["mousePos"] = [x, y]
// }

export let getPickEventName = () => "meta3d_pick"

export let getEnterEventName = () => "meta3d_enter"

export let createState = (): pick => {
    let raycaster = new Raycaster()

    setPickableLayer(raycaster.layers)

    return {
        screenCoordniate: null,
        targets: List(),
        raycaster: raycaster
    }
}

// let _initState = (state: state) => {
//     let raycaster = new Raycaster()
//     // enableVisibleLayer(raycaster.layers)
//     // enablePickableLayer(raycaster.layers)
//     setPickableLayer(raycaster.layers)

//     return setPickState(state, {
//         // mouse: null,
//         // lastMouse: null,
//         screenCoordniate: null,
//         targets: List(),
//         raycaster: raycaster
//     })
// }

let _getIntersects = (state: state, mouse) => {
    let camera = getCurrentCamera(state)
    let scene = getCurrentScene(state)

    let { raycaster } = getPickState(state)

    return getWithDefault(
        map(mouse => {
            raycaster.setFromCamera(mouse, camera);

            return raycaster.intersectObject(scene, true);
        }, mouse),
        []
    )
}

let _handlePickEvent = (getAbstractStateFunc, specficState, userData) => {
    let event = getExn(userData)

    let [pageX, pageY] = getPageData(event)
    let x = (pageX / getWidth()) * 2 - 1;
    let y = - (pageY / getHeight()) * 2 + 1;
    // let x = (pageX / window.innerWidth) * 2 - 1;
    // let y = - (pageY / window.innerHeight) * 2 + 1;

    let state = getAbstractStateFunc(specficState)

    let targets = List(_getIntersects(state, new Vector2(x, y)))

    // let topTarget = null
    if (targets.count() > 0) {
        console.log(targets.get(0))
    }


    state = setPickState(state, {
        ...getPickState(state),
        screenCoordniate: return_(new Vector2(pageX, pageY)),
        targets: targets
    })

    return [state, targets]
}

let _bindEvent = (state: state, [getAbstractStateFunc, setAbstractStateFunc]) => {
    // state = on(state, getPointerTapEventName(), (specficState, { userData }) => {
    state = on(state, getSingleClickEventName(), (specficState, { userData }) => {
        let [state, targets] = _handlePickEvent(getAbstractStateFunc, specficState, userData)

        return trigger(setAbstractStateFunc(specficState, state), getAbstractStateFunc, getPickEventName(), {
            targets: targets,
        })
    })

    state = on(state, getDoubleClickEventName(), (specficState, { userData }) => {
        let [state, targets] = _handlePickEvent(getAbstractStateFunc, specficState, userData)

        return trigger(setAbstractStateFunc(specficState, state), getAbstractStateFunc, getEnterEventName(), {
            targets: targets,
        })
    })

    return state
}

// export let storeEventData = (state: state) => {
//     if (!isNullable(globalThis["mousePos"])) {
//         return setPickState(state, {
//             ...getPickState(state),
//             lastMouse: getPickState(state).mouse,
//             mouse: getExn(globalThis["mousePos"]),
//         })
//     }

//     return state
// }


// export let isPickTargetChange = (state: state) => {
//     let { mouse, lastMouse } = getPickState(state)

//     return getWithDefault(
//         bind(mouse => {
//             return map(lastMouse => {
//                 return !mouse.equals(lastMouse)
//             }, lastMouse)
//         }, mouse),
//         false
//     )
// }

export let getTagets = (state: state) => {
    return getPickState(state).targets
}

export let init = (state: state, [getAbstractStateFunc, setAbstractStateFunc]) => {
    // state = _initState(state)
    state = _bindEvent(state, [getAbstractStateFunc, setAbstractStateFunc])

    return Promise.resolve(state)
}

export let dispose = (state: state) => {
    return setPickState(state, createState())
}