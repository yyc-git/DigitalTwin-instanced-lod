import { createState as createParkSceneState } from "../script/scene/scene_park/ParkScene"
import { createState as createWarehouseSceneState } from "../script/scene/scene_warehouse/WarehouseScene"
import { config, state } from "../type/StateType"
import { parkScene } from "../script/scene/scene_park/type/StateType"
import { warehouseScene } from "../script/scene/scene_warehouse/type/StateType"
import { State } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
// import { createState as createAbstractState } from "meta3d-jiehuo-abstract"
import { state as abstractState } from "meta3d-jiehuo-abstract/src/type/StateType"
// import {NullableUtils} from "meta3d-jiehuo-abstract"


export let createState = (): state => {
    return {
        abstract: State.createState(),
        config: {
            isProduction: false
        },
        parkScene: createParkSceneState(),
        warehouseScene: createWarehouseSceneState()
    }
}

export let readState = () => {
    return NullableUtils.getExn(globalThis["meta3d_state"]) as state
}

export let writeState = (state: state) => {
    globalThis["meta3d_state"] = state

    return state
}

export let getAbstractState = (state: state) => {
    return state.abstract
}

export let setAbstractState = (state: state, abstractState: abstractState) => {
    return {
        ...state,
        abstract: abstractState
    }
}

export let getConfigState = (state: state) => {
    return state.config
}

export let setConfigState = (state: state, configState: config) => {
    return {
        ...state,
        config: configState
    }
}

export let getParkSceneState = (state: state) => {
    return state.parkScene
}

export let setParkSceneState = (state: state, parkSceneState: parkScene) => {
    return {
        ...state,
        parkScene: parkSceneState
    }
}

export let getWarehouseSceneState = (state: state) => {
    return state.warehouseScene
}

export let setWarehouseSceneState = (state: state, warehouseSceneState: warehouseScene) => {
    return {
        ...state,
        warehouseScene: warehouseSceneState
    }
}