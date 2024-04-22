import { state } from "../../../type/StateType"
import { getIsDebug } from "../Scene"
import { getScene } from "./ParkScene"
import { DirectionLight } from "meta3d-jiehuo-abstract"
import { DirectionalLight, Object3D, Vector3 } from "three"
import { DirectionLightShadow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../state/State"

export let addDirectionLight = (state: state, scene, renderer): [state, Object3D] => {
    let light = DirectionLight.createDirectionLight(scene, getIsDebug(state), {
        position: new Vector3(0, 100, -60),
        target: new Vector3(0, 0, 0),
        intensity: 2,
        color: 0xffffff
    })

    let data = DirectionLightShadow.enableShadow(scene, light, renderer, getIsDebug(state))
    scene = data[0]
    light = data[1]
    renderer = data[2]

    scene.add(light, light.target)

    return [state, scene]
}

export let getLight = (state: state) => {
    return DirectionLight.findLights(getAbstractState(state))[0]
}

export let updateShadow = (state: state) => {
    getScene(state).traverse((object: any) => {
        if (object.isDirectionalLight) {
            let _ = DirectionLightShadow.updateShadow(object as DirectionalLight)
        }
    })

    return state
}