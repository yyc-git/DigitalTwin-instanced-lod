import { DirectionalLight, PCFShadowMap, WebGLRenderer , CameraHelper, Object3D} from "three";
import { ShadowMapViewer } from "three/examples/jsm/utils/ShadowMapViewer";
import { state } from "../type/StateType";
import { getLightState, setLightState } from "../state/State";
import { getExn, isNullable, return_ } from "../utils/NullableUtils";
import { getRenderer } from "../Render";

// export let enableShadow = (state: state, light: DirectionalLight, renderer: WebGLRenderer, isDebug): [state, DirectionalLight, WebGLRenderer] => {
export let enableShadow = (scene, light: DirectionalLight, renderer: WebGLRenderer, isDebug): [Object3D, DirectionalLight, WebGLRenderer] => {
    light.castShadow = true
    let size = 600
    light.shadow.camera.top = size;
    light.shadow.camera.bottom = -size;
    light.shadow.camera.left = - size;
    light.shadow.camera.right = size;
    light.shadow.camera.near = 0.5;
    light.shadow.bias = -0.004

    // const SHADOW_MAP_WIDTH = 128, SHADOW_MAP_HEIGHT = 128;
    const SHADOW_MAP_WIDTH = 1024, SHADOW_MAP_HEIGHT = 512;
    light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    light.shadow.autoUpdate = false
    light.shadow.needsUpdate = true

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;

    if (isDebug) {
        // let dirLightShadowMapViewer = new ShadowMapViewer(light)

        // state = setLightState(state, {
        //     ...getLightState(state),
        //     directionLightShadowMapViewer: return_(dirLightShadowMapViewer)
        // })

				scene.add( new CameraHelper( light.shadow.camera ) );
    }

    return [scene, light, renderer]
}

export let updateShadow = (light: DirectionalLight) => {
    light.shadow.needsUpdate = true

    return light
}

// export let updateForWindowResize = (state: state) => {
//     // if (isNullable(getLightState(state).directionLightShadowMapViewer)) {
//     //     return state
//     // }

//     // getExn(getLightState(state).directionLightShadowMapViewer).update()
//     // getExn(getLightState(state).directionLightShadowMapViewer).updateForWindowResize()

//     return state
// }

// export let render = (state: state) => {
//     // if (isNullable(getLightState(state).directionLightShadowMapViewer)) {
//     //     return state
//     // }

//     // getExn(getLightState(state).directionLightShadowMapViewer).render(getRenderer(state))

//     return state
// }