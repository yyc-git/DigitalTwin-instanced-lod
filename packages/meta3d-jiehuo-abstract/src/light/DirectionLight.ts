import { DirectionalLight, DirectionalLightHelper, PCFShadowMap } from "three"
import { state } from "../type/StateType"
import { findObjects, getScene } from "../scene/Scene"

export let createDirectionLight = (scene, isDebug, {
    position,
    target,
    intensity,
    color
}) => {
    let light = null

    light = new DirectionalLight(color, intensity)
    light.position.copy(position)
    light.target.position.copy(target)
    scene.add(light)
    scene.add(light.target)

    if (isDebug) {
        let helper = new DirectionalLightHelper(light);
        scene.add(helper);
    }


    return light
}

export let findLights = (state: state): Array<DirectionalLight> => {
    return findObjects(getScene(state), (object) => {
        return object.isDirectionalLight
    })
}