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
import { animated, tree } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).animated)
}

let _setState = (state: state, animatedState: animated) => {
    return setState(state, {
        ...getState(state),
        animated: NullableUtils.return_(animatedState)
    })
}

export let buildName = () => "animated"

export let findAllAnimateds = (scene) => {
    return Scene.findObjects(scene, ({ name }) => name == buildName())
}

export let parseAndAddResources = (state: state) => {
    let box = new Object3D()
    let geometry = NewThreeInstance.createBoxGeometry(5, 5, 5)
    let material = NewThreeInstance.createMeshPhysicalMaterial({})
    let mesh1 = NewThreeInstance.createMesh(geometry, material)
    geometry = NewThreeInstance.createBoxGeometry(7, 7, 7)
    material = NewThreeInstance.createMeshPhysicalMaterial({})
    let mesh2 = NewThreeInstance.createMesh(geometry, material)
    mesh2.position.set(10, 0, 0)
    mesh1.add(mesh2)
    box.add(mesh1)

    return _setState(state, {
        ..._getState(state),
        box: NullableUtils.return_(box)
    })

}

export let createState = (): animated => {
    return {
        box: null
    }
}