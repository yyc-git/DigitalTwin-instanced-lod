import { articluatedAnimation, pick, render, camera, scene, state, event, stats, loader, skinAnimation, device, instance, light, lod, config, flow } from "../type/StateType"
import { Map } from "immutable"
import { createState as createArticluatedAnimationState } from "../animation/ArticluatedAnimation"
import { createState as createSkinAnimationState } from "../animation/SkinAnimation"
import { createState as createEventState } from "../Event"
import { createState as createDeviceState } from "../Device"
import { createState as createSceneState } from "../scene/Scene"
import { createState as createInstanceState } from "../instance/Instance"
import { createState as createLightState } from "../light/Light"
import { createState as createLODState } from "../lod/LOD"
import { createState as createPickState } from "../Pick"
import { createState as createFlowState } from "../Flow"
import { getExn, return_ } from "../utils/NullableUtils"

export let getIsDebug = (state: state) => {
    return getConfigState(state).isDebug
}

export let setIsDebug = (state: state, isDebug) => {
    return setConfigState(state, {
        ...getConfigState(state),
        isDebug: isDebug
    })
}

export let createState = (): state => {
    return {
        device: createDeviceState(),
        render: null,
        scene: createSceneState(),
        pick: createPickState(),
        articluatedAnimation: createArticluatedAnimationState(),
        skinAnimation: createSkinAnimationState(),
        event: createEventState(),
        stats: null,
        loader: {
            resourceData: Map()
        },
        instance: createInstanceState(),
        lod: createLODState(),
        light: createLightState(),
        config: {
            isDebug: false
        },
        flow: createFlowState(),
    }
}

export let getDeviceState = (state: state) => {
    return getExn(state.device)
}

export let setDeviceState = (state: state, deviceState: device) => {
    return {
        ...state,
        device: return_(deviceState)
    }
}

export let getRenderState = (state: state) => {
    return getExn(state.render)
}

export let setRenderState = (state: state, renderState: render) => {
    return {
        ...state,
        render: return_(renderState)
    }
}

// export let getCameraState = (state: state) => {
//     return getExn(state.camera)
// }

// export let setCameraState = (state: state, cameraState: camera) => {
//     return {
//         ...state,
//         camera: return_(cameraState)
//     }
// }

export let getSceneState = (state: state) => {
    return state.scene
}

export let setSceneState = (state: state, sceneState: scene) => {
    return {
        ...state,
        scene: sceneState
    }
}

export let getPickState = (state: state) => {
    return getExn(state.pick)
}

export let setPickState = (state: state, pickState: pick) => {
    return {
        ...state,
        pick: return_(pickState)
    }
}

export let getArticluatedAnimationState = (state: state) => {
    return state.articluatedAnimation
}

export let setArticluatedAnimationState = (state: state, articluatedAnimationState: articluatedAnimation) => {
    return {
        ...state,
        articluatedAnimation: articluatedAnimationState
    }
}

export let getSkinAnimationState = (state: state) => {
    return state.skinAnimation
}

export let setSkinAnimationState = (state: state, skinAnimationState: skinAnimation) => {
    return {
        ...state,
        skinAnimation: skinAnimationState
    }
}

export let getEventState = (state: state) => {
    return state.event
}

export let setEventState = (state: state, eventState: event) => {
    return {
        ...state,
        event: eventState
    }
}

export let getStatsState = (state: state) => {
    return getExn(state.stats)
}

export let setStatsState = (state: state, statsState: stats) => {
    return {
        ...state,
        stats: return_(statsState)
    }
}

// export let getInstanceState = (state: state) => {
//     return getExn(state.instance)
// }

// export let setInstanceState = (state: state, instantState: instance) => {
//     return {
//         ...state,
//         instance: return_(instantState)
//     }
// }


export let getLoaderState = (state: state) => {
    return state.loader
}

export let setLoaderState = (state: state, loaderState: loader) => {
    return {
        ...state,
        loader: loaderState
    }
}

export let getInstanceState = (state: state) => {
    return state.instance
}

export let setInstanceState = (state: state, instanceState: instance) => {
    return {
        ...state,
        instance: instanceState
    }
}

export let getLightState = (state: state) => {
    return state.light
}

export let setLightState = (state: state, lightState: light) => {
    return {
        ...state,
        light: lightState
    }
}

export let getLODState = (state: state) => {
    return state.lod
}

export let setLODState = (state: state, lodState: lod) => {
    return {
        ...state,
        lod: lodState
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

export let getFlowState = (state: state) => {
    return state.flow
}

export let setFlowState = (state: state, flowState: flow) => {
    return {
        ...state,
        flow: flowState
    }
}