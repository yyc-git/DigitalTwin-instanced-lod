import { state } from "../../type/StateType"
import * as ParkScene from "./scene_park/ParkScene"
import * as WarehouseScene from "./scene_warehouse/WarehouseScene"
import { scene } from "../../../ui_layer/global/store/GlobalStoreType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getAbstractState, getConfigState, readState, setAbstractState, setConfigState, writeState } from "../../state/State"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Render } from "meta3d-jiehuo-abstract"
import { State } from "meta3d-jiehuo-abstract"
import { Scene } from "meta3d-jiehuo-abstract"
import { getCurrentScene } from "meta3d-jiehuo-abstract/src/scene/Scene"

// export let initAllScenes = (state: state) => {
//     return ParkScene.init(state).then(state => {
//         return WarehouseScene.init(state)
//     })
// }

export let getAllScenes = (state: state) => {
    return [
        ParkScene.getNullableScene(state),
        WarehouseScene.getNullableScene(state),
    ].reduce((result, nullableScene) => {
        return NullableUtils.getWithDefault(NullableUtils.map(nullableScene => {
            return result.concat([nullableScene])
        }, nullableScene), result)
    }, [])
}

let _disposeCurrentScene = (state: state, currentScene: scene) => {
    state = setAbstractState(state, ArticluatedAnimation.removeAllArticluatedAnimations(getAbstractState(state)))

    let promise
    switch (currentScene) {
        case scene.Park:
            promise = ParkScene.dispose(state)
            break
        case scene.Warehouse:
            promise = WarehouseScene.dispose(state)
            break
        default:
            // throw new Error("error")
            break
    }

    return promise.then(state => {
        return setAbstractState(state, Scene.dispose(getAbstractState(state)))
    })
}

export let updateCurrentScene = (state: state, name) => {
    // Scene.updateMatrixWorld(getCurrentScene(getAbstractState(state)))

    return ArticluatedAnimation.updateAllArticluatedAnimations(state, [readState, writeState, getAbstractState]).then(state => {
        switch (name) {
            case ParkScene.getName():
                return ParkScene.update(state)
            case WarehouseScene.getName():
                return WarehouseScene.update(state)
            default:
                throw new Error("error")
        }
    }).then(state => {
        Scene.updateMatrixWorld(getCurrentScene(getAbstractState(state)))
        // Scene.markNotNeedsUpdate(getCurrentScene(getAbstractState(state)))

        return state
    })
}

export let switchScene = (state: state, currentScene: scene, targetScene: scene, sceneNumber: number) => {
    return _disposeCurrentScene(state, currentScene).then(state => {
        switch (targetScene) {
            case scene.Park:
                return ParkScene.enterScene(state, sceneNumber)
            case scene.Warehouse:
                return WarehouseScene.enterScene(state, sceneNumber)
            default:
                throw new Error("error")
        }
        // return state
    }).then(state => {
        return setAbstractState(state, Render.markIsNeedSetSize(getAbstractState(state), true))
    })
}

export let getIsDebug = (state: state) => {
    return State.getConfigState(getAbstractState(state)).isDebug
}

export let setIsDebug = (state: state, isDebug) => {
    return setAbstractState(state, State.setConfigState(getAbstractState(state), {
        ...State.getConfigState(getAbstractState(state)),
        isDebug
    }))
}

export let getIsProduction = (state: state) => {
    return getConfigState(state).isProduction
}

export let setIsProduction = (state: state, isProduction) => {
    return setConfigState(state, {
        ...getConfigState(state),
        isProduction: isProduction
    })
}

export let getCurrentCameraType = (state: state, currentScene: scene) => {
    switch (currentScene) {
        case scene.Park:
            return ParkScene.getCameraType(state)
        case scene.Warehouse:
            return WarehouseScene.getCameraType(state)
        default:
            throw new Error("error")
    }
}