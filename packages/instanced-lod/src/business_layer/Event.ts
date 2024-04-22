import { state } from "../scene3d_layer/type/StateType";
import { getAbstractState } from "../scene3d_layer/state/State";
import { setAbstractState } from "./State";
import { Event } from "meta3d-jiehuo-abstract";

export let on = (state: state, name, handler) => {
    return setAbstractState(state, Event.on(getAbstractState(state), name, handler))
}

export let off = (state: state, name, handler) => {
    return setAbstractState(state, Event.off(getAbstractState(state), name, handler))
}