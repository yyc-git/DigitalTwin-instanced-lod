import type { Scene } from "three"
import { WebGLRenderer, Vector2, Color, SRGBColorSpace, PMREMGenerator } from "three"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// import { EffectComposer } from './three/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { OutlinePass } from './three/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { state } from './type/StateType'
// import { getExn } from "./utils/NullableUtils"
import { getCurrentCamera } from "./scene/Camera"
import { getHeight, getWidth } from "./View"
import { getCurrentScene, getScene,  } from "./scene/Scene"
import { getDeviceState, getRenderState, setDeviceState, setRenderState } from "./state/State"
import * as DirectionLightShadow from "./light/DirectionLightShadow"
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export let createRenderer = () => {
    let canvas = document.querySelector('#canvas')

    return new WebGLRenderer({ antialias: true, canvas: canvas })
}

let _createComposer = (renderer, camera, scene): [EffectComposer, RenderPass, OutlinePass, ShaderPass] => {
    let composer = new EffectComposer(renderer)

    if (renderer.getContext() instanceof WebGL2RenderingContext) {
        composer.renderTarget1.samples = 8;
        composer.renderTarget2.samples = 8;
    }
    else {
        console.warn("not open msaa");
    }


    let renderPass = new RenderPass(scene, camera)

    composer.renderToScreen = true

    // renderPass.clearColor = new Color(0x9C9C9C)
    renderPass.clearAlpha = 1.0

    composer.addPass(renderPass)



    let outlinePass = new OutlinePass(new Vector2(getWidth(), getHeight()), scene, camera)

    composer.addPass(outlinePass)



    /*! because set renderTarget->colorSpace not work, so need use gamma correction here
*/
    let gammaCorrection = new ShaderPass(GammaCorrectionShader)
    gammaCorrection.needsSwap = false
    composer.addPass(gammaCorrection)


    /*! clear color after gamma is increased! should restore it correctly */
    // renderPass.clearColor = new Color(0x595959)


    renderPass.clearColor = new Color(0x000000)



    return [composer, renderPass, outlinePass, gammaCorrection]
}

let _setSizeAndViewport = (renderer, composer) => {
    // console.log(
    //     document.documentElement.clientWidth,
    //     document.documentElement.clientHeight,
    //     window.innerWidth,
    //     window.innerHeight
    // );
    renderer.setSize(getWidth(), getHeight())
    // renderer.setViewport(0, 0, getWidth(), getHeight())

    composer.setSize(getWidth(), getHeight())


    // state = DirectionLightShadow.updateForWindowResize(state)
}


export let setSizeAndViewport = (state) => {
    _setSizeAndViewport(getRenderer(state), getRenderState(state).composer)
}

let _bindResizeEvent = (renderer, composer) => {
    window.addEventListener("resize", _ => {
        // camera.aspect = getWidth() / getHeight()
        // camera.updateProjectionMatrix()

        _setSizeAndViewport(renderer, composer)
    })
}

export let init = (state: state, renderer) => {
    // let camera = getCurrentCamera(state)
    let scene = getScene(state)

    let [composer, renderPass, outlinePass, gammaCorrection] = _createComposer(renderer, null, scene)

    renderer.setPixelRatio(window.devicePixelRatio)

    renderer.outputColorSpace = SRGBColorSpace;







    // composer.setPixelRatio(window.devicePixelRatio)

    // state = _setSizeAndViewport(state, renderer, composer)


    _bindResizeEvent(renderer, composer)

    // _setSizeAndViewport(renderer, composer)

    state = setRenderState(state, {
        canvas: renderer.domElement,
        isNeedSetSize: true,
        renderer,
        composer,
        renderPass,
        outlinePass,
        gammaCorrection
    })


    return Promise.resolve(state)
}

export let update = (state: state) => {
    let { renderPass, outlinePass } = getRenderState(state)

    let scene = getCurrentScene(state) as Scene
    let camera = getCurrentCamera(state)

    renderPass.scene = scene
    renderPass.camera = camera

    outlinePass.renderScene = scene
    outlinePass.renderCamera = camera




    return Promise.resolve(state)
}

export let markIsNeedSetSize = (state, isNeedSetSize) => {
    return setRenderState(state, {
        ...getRenderState(state),
        isNeedSetSize: isNeedSetSize
    })
}

export let render = (state: state) => {
    let { renderer, composer, isNeedSetSize } = getRenderState(state)
    // let deviceState = getDeviceState(state)

    // if (width != deviceState.width || height != deviceState.height) {
    //     console.log(
    //         width, height, deviceState.width, deviceState.height
    //     );

    //     state = _setSizeAndViewport(state, renderer, composer)

    //     state = _updateSize(state)
    // }
    // state = _setSizeAndViewport(state, renderer, composer)

    if (isNeedSetSize) {
        setTimeout(() => {
            _setSizeAndViewport(renderer, composer);
        }, 100)

        state = markIsNeedSetSize(state, false)
    }

    getRenderState(state).composer.render()

    // state = DirectionLightShadow.render(state)

    return Promise.resolve(state)
}

export let getCanvas = (state: state) => {
    return getRenderState(state).canvas
}

export let getRenderer = (state: state) => {
    return getRenderState(state).renderer
}