import { Clock } from "three"
import { state } from "./type/StateType"
import { getDeviceState, setDeviceState } from "./state/State"
import * as View from "./View"

export let createState = () => {
    return {
        clock: new Clock(),
        delta: 0,
    }
}

export let getDelta = (state: state) => {
    return getDeviceState(state).delta
}

// export let getWidth = (state: state) => {
//     return getDeviceState(state).width
// }

// export let getHeight = (state: state) => {
//     return getDeviceState(state).height
// }

export let init = (state: state) => {
    state.device.clock.start()

    return Promise.resolve(state)
}

export let update = (state: state) => {
    state = setDeviceState(state, {
        ...getDeviceState(state),
        delta: Math.min(0.05, state.device.clock.getDelta()),
    })

    return Promise.resolve(state)
}

export let isMobile = () => {
    return window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}

export let isIOS = () => {
    return /(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)
}