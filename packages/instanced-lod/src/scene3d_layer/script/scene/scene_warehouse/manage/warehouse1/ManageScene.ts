import { Instance } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { cameraType, state } from "../../../../../type/StateType"
import * as Girl from "../../Girl"
import { getCurrentMode, getScene, getState, setCurrentMode } from "../../WarehouseScene"
import { mode } from "../../type/StateType"
import * as Cabinet1 from "./Cabinet1"
import { Scene } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
import * as  OpereateCabinetMode from "../../mode_operate_cabinet/OperateCabinetMode"

let _parseAndAddResources = (state: state) => {
    return Girl.parseAndAddResources(state).then(Cabinet1.parseAndAddResources)
}

export let initWhenImportScene = (state: state) => {
    return Girl.initWhenImportScene(state).then(Cabinet1.initWhenImportScene)
}

export let init = (state: state) => {
    // return Promise.resolve(state)
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

    state = setAbstractState(state, Instance.updateAllInstances(getAbstractState(state)))

    return Promise.resolve(state)
}

export let dispose = (state: state) => {
    let scene = getScene(state)

    return Cabinet1.dispose(state).then(Girl.dispose).then(state => {
        Scene.getScene(getAbstractState(state)).remove(scene)

        DisposeUtils.deepDispose(scene)

        state = setCurrentMode(state, mode.Default)

        state = OpereateCabinetMode.dispose(state)

        return state
    })
}

export let playCabinetDrawerGoInArticluatedAnimation = (state: state) => {
    return Cabinet1.playDrawerGoInArticluatedAnimation(state)
}