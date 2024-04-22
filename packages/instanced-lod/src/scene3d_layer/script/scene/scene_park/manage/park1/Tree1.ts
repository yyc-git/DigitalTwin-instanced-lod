import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { Loader } from "meta3d-jiehuo-abstract"
import { getState, getTree1HighResourceId, getTree1LowResourceId, getTree1MiddleResourceId, setState } from "../../ParkScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Object3D, Vector3 } from "three"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { tree } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).tree)
}

let _setState = (state: state, treeState: tree) => {
    return setState(state, {
        ...getState(state),
        tree: NullableUtils.return_(treeState)
    })
}

export let buildName = () => "tree1"

export let findAllTree1s = (scene) => {
    return Scene.findObjects(scene, ({ name }) => name == buildName())
}

export let parseAndAddResources = (state: state) => {
    let abstractState = getAbstractState(state)

    let tree1 = new InstanceSourceLOD.InstanceSourceLOD()

    // cabinetDrawer.receiveShadow = true
    // cabinetDrawer.castShadow = false


    return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, getTree1LowResourceId()), Render.getRenderer(abstractState)).then((low: Object3D) => {
        return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, getTree1MiddleResourceId()), Render.getRenderer(abstractState)).then((middle: Object3D) => {
            return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, getTree1HighResourceId()), Render.getRenderer(abstractState)).then((high: Object3D) => {

                low.matrixAutoUpdate = false
                middle.matrixAutoUpdate = false
                high.matrixAutoUpdate = false

                tree1.addLevel(high, 100, 0, getIsDebug(state))
                tree1.addLevel(middle, 250, 0, getIsDebug(state))
                tree1.addLevel(low, +Infinity, 0, getIsDebug(state))


                tree1.scale.multiply(new Vector3(0.5, 0.5, 0.5))

                return _setState(state, {
                    ..._getState(state),
                    tree1: NullableUtils.return_(tree1 as any)
                })
            })
        })
    })
}

export let createState = ():tree => {
    return {
        tree1: null
    }
}