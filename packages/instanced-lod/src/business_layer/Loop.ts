import { state } from "../scene3d_layer/type/StateType"
import { Event, Render, Outline, Stats, Pick, Camera, Scene, Device, } from "meta3d-jiehuo-abstract"
// import { init as initEvent, update as updateEvent } from "meta3d-jiehuo-abstract"
// import { createRenderer, init as initRender, render, update as updateRender } from "meta3d-jiehuo-abstract"
// import { importScene as importWarehouse1Scene, init as initWarehouse1Scene } from "./script/scene/scene_warehouse/WarehouseScene"
// import { init as initArticluatedAnimation } from "meta3d-jiehuo-abstract"
// import { init as initOutline } from "meta3d-jiehuo-abstract"
// import { addStats, update as updateStats } from "meta3d-jiehuo-abstract"
import { getScene as getParkScene, enterScene as enterParkScene, init as initParkScene } from "../scene3d_layer/script/scene/scene_park/ParkScene"
// import { getCurrentScene, setCurrentScene, update as updateScene } from "meta3d-jiehuo-abstract"
// import { init as initCamera, update as updateCamera } from "meta3d-jiehuo-abstract"
import { scene } from "../ui_layer/global/store/GlobalStoreType"
import { enterScene as enterWarehouseScene } from "../scene3d_layer/script/scene/scene_warehouse/WarehouseScene"
import { getAbstractState, readState, setAbstractState, writeState } from "./State"
import { getIsProduction, updateCurrentScene } from "../scene3d_layer/script/scene/Scene"
import { Instance } from "meta3d-jiehuo-abstract"
import { Flow } from "meta3d-jiehuo-abstract"
// import { init as initCamera} from "./script/scene/Camera"

export let init = (state: state, currentScene: scene, sceneNumber: number) => {
    let renderer = Render.createRenderer()

    return Device.init(getAbstractState(state)).then(abstractState => {
        return Render.init(abstractState, renderer)
    }).then(abstractState => {
        if (!getIsProduction(state)) {
            abstractState = Stats.addStats(abstractState)
        }

        return Event.init(abstractState, getAbstractState)
    }).then(abstractState => {
        return Pick.init(abstractState, [getAbstractState, setAbstractState])
    }).then(abstractState => {
        return Outline.init(abstractState)
    }).then(abstractState => {
        return Scene.init(abstractState, [getAbstractState, setAbstractState, readState, writeState])
    }).then(abstractState => {
        state = setAbstractState(state, abstractState)

        switch (currentScene) {
            case scene.Park:
                return enterParkScene(state, sceneNumber)
            case scene.Warehouse:
            default:
                return enterWarehouseScene(state, sceneNumber)
        }
    })
}


let _update = (state: state) => {
    return Device.update(getAbstractState(state)).then(abstractState => {
        return Event.update(setAbstractState(state, abstractState), getAbstractState)
    }).then(state => {
        return Scene.update(state, [updateCurrentScene, getAbstractState, setAbstractState])

        // return Camera.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
    })
        // .then(state => {
        //     return updateCurrentScene(state, Scene.getCurrentScene(getAbstractState(state)).name)
        // })
        .then(state => {
            return Render.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
        })
        .then(state => {
            // return Flow.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
            return Flow.update(state, [getAbstractState, setAbstractState])
        })
}

let _render = (state: state) => {
    return Render.render(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
}

export let loop = () => {
    requestAnimationFrame((time) => {
        let state = readState()

        if (!Flow.isLoopStart(getAbstractState(state))) {
            loop()
            return
        }

        if (!getIsProduction(state)) {
            Stats.begin(getAbstractState(state))
        }

        _update(state).then(state => _render(state)).then(state => {
            writeState(state)

            if (!getIsProduction(state)) {
                Stats.end(getAbstractState(state))
                Stats.nextFrame(getAbstractState(state), time)
            }

            loop()
        })
    })
}

export let stopLoop = (state: state) => {
    return setAbstractState(state, Flow.stopLoop(getAbstractState(state)))
}

export let startLoop = (state: state) => {
    return setAbstractState(state, Flow.startLoop(getAbstractState(state)))
}