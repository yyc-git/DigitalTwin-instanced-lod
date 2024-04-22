import { Map } from "immutable"
import { lod, state } from "../type/StateType"
import { setLODState } from "../state/State"

export let createState = (): lod => {
    return {
        instancedMesh2LevelsMap: Map(),
    }
}

export let dispose = (state: state) => {
    return setLODState(state, createState())
}