import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { cameraType, state } from "../../../../../type/StateType"
import * as Girl from "../../Girl"
import { getCurrentMode, getScene, getState, setCurrentMode } from "../../WarehouseScene"
import { mode } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"

let _parseAndAddResources = (state: state) => {
    return Girl.parseAndAddResources(state)
}

export let initWhenImportScene = (state: state) => {
    return Girl.initWhenImportScene(state)
}

export let init = (state: state) => {
    return _parseAndAddResources(state)
}

export let update = (state: state) => {
    switch (getCurrentMode(state)) {
        case mode.OpearteCabinet:
            break
        case mode.Default:
        default:
            if (getState(state).cameraType == cameraType.ThirdPerson) {
                state = Girl.update(state)
            }
            break
    }

    return Promise.resolve(state)
}

export let dispose = (state: state) => {
    let scene = getScene(state)

    return Girl.dispose(state).then(state => {
        Scene.getScene(getAbstractState(state)).remove(scene)

        DisposeUtils.deepDispose(scene)

        return state
    })
}