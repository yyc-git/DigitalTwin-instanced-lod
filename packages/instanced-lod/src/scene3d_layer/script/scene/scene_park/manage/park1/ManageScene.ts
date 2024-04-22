import { Instance } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { cameraType, state } from "../../../../../type/StateType"
import * as Girl from "../../Girl"
import * as Tree1 from "./Tree1"
import * as Animated from "./Animated"
import { getScene, getState } from "../../ParkScene"
import { Scene } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"

let _parseAndAddResources = (state: state) => {
    return Tree1.parseAndAddResources(state).then(Animated.parseAndAddResources).then(Girl.parseAndAddResources)
}

export let initWhenImportScene = (state: state) => {
    return Girl.initWhenImportScene(state)
}

export let init = (state: state) => {
    return _parseAndAddResources(state)
}

export let update = (state: state) => {

    Animated.findAllAnimateds(getScene(state)).forEach((obj, i) => {
        if (i % 5 !== 0) {
            return
        }

        if (obj.position.x > 500) {
            // obj.position.copy(initialPosition)
            obj.position.setX((Math.random() * 2 - 1) * 300)
        }
        else {
            obj.position.setX(obj.position.x + 2)
        }

        Object3DUtils.markNeedsUpdate(obj)
        // let _ = Object3DUtils.markNeedsUpdate(clonedOne)
    })


    if (getState(state).cameraType == cameraType.ThirdPerson) {
        state = Girl.update(state)
    }

    state = setAbstractState(state, Instance.updateAllInstances(getAbstractState(state)))

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