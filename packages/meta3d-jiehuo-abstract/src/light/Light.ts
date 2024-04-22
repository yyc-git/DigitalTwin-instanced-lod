import { setLightState } from "../state/State";
import { light, state } from "../type/StateType";

export let createState = (): light => {
    return {
        directionLightShadowMapViewer: null
    }
}

export let dispose = (state: state) => {
    return setLightState(state, createState())
}