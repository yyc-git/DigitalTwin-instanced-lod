import { WebGLRenderer, Object3D, Camera, Vector2, Raycaster, Scene, Clock, AnimationMixer, AnimationClip, Mesh, Color, Vector3, LOD, Box3 } from "three"
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import type { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import type { OutlinePass } from '../three/OutlinePass'
import type { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
// import type Stats from "three/examples/jsm/libs/glBench.module"
import type GLBench from 'gl-bench/dist/gl-bench';
import type RendererStats from 'three-webgl-stats';
import { nullable } from "../utils/nullable"
import type { Map, List } from "immutable"
import type { JoystickManager } from 'nipplejs'
import type { ShadowMapViewer } from "three/examples/jsm/utils/ShadowMapViewer"
import { InstancedMesh2 } from "../instance/InstancedMesh2"
import { InstancedMesh2LOD } from "../lod/InstancedMesh2LOD"
import { InstanceSourceLOD } from "../lod/InstanceSourceLOD"
// import { InstancedMeshBVH } from "../instance/InstancedMeshBVH"

export type render = {
    canvas: HTMLCanvasElement,
    // width: number,
    // height: number,
    isNeedSetSize: boolean,
    renderer: WebGLRenderer,
    composer: EffectComposer,
    renderPass: RenderPass,
    outlinePass: OutlinePass,
    gammaCorrection: ShaderPass
}

export type pick = {
    // mouse: nullable<Vector2>,
    // lastMouse: nullable<Vector2>,
    screenCoordniate: nullable<Vector2>,
    targets: List<any>,
    raycaster: Raycaster
}

export type tweenId = string

export type tween = any


export enum articluatedAnimationStatus {
    Playing,
    NotPlaying
}

export type articluatedAnimationName = string

export type articluatedAnimation = {
    articluatedAnimationTweens: Map<articluatedAnimationName, Array<tween>>,
    articluatedAnimationStatus: Map<articluatedAnimationName, articluatedAnimationStatus>
}

export type skinAnimationName = string

export type skinTargetName = string

export type skinAnimation = {
    animationClips: Map<skinAnimationName, AnimationClip>,
    animationNames: Map<skinTargetName, List<skinAnimationName>>,
    mixerMap: Map<skinTargetName, AnimationMixer>
}

type key = string

export type thirdPersonControls = {
    keyState: Map<key, boolean>,
    joystickManager: nullable<JoystickManager>,
    moveHandlerFunc: nullable<any>,
    endHandlerFunc: nullable<any>,
    forward: number,
    back: number,
    left: number,
    right: number,
}

export type camera = {
    currentCamera: nullable<Camera>,
    currentControls: nullable<any>,
    orbitControls: nullable<OrbitControls>,
    thirdPersonControls: nullable<thirdPersonControls>,
    trackballControls: nullable<TrackballControls>,
}

export type scene = {
    scene: Scene,
    currentScene: nullable<Object3D>,
    camera: nullable<camera>,
}

export type eventName = string

export type customEvent = {
    name: eventName,
    userData: nullable<any>
}

export type handler<specificState> = (state: specificState, customEvent: customEvent) => Promise<specificState>

export type event = {
    handlers: Map<eventName, List<handler<any>>>
}

export type stats = {
    glBench: GLBench,
    rendererStats: RendererStats
}

// type instancedMeshName = string

// export type sourceMeshName = string
// export type sourceMeshId = number

export type instanceIndex = number

export type sourceObjectName = string

// export enum lodLevel {
//     High,
//     Midium,
//     Low
// }

// export type sourceLodData = {
//     maxDistanceToCamera: number,
//     sourceObjects: Array<Object3D>,
//     // level: lodLevel
// }

// type objectId = number

// type lodObject = {
//     object: Object3D,
//     // lodDataMap: Map<objectId, {
//     //     maxDistanceToCamera: number,
//     //     geometry,
//     //     material
//     // }>
//     lodData: Array<{
//         maxDistanceToCamera: number,
//         geometry,
//         material
//     }>
// }

// export type allSourceLodData = {
//     // maxDistanceToCamera: number,
//     sourceObjects: Array<LOD>,
//     // level: lodLevel
// }

type object3DId = number

export type instancedSourceId = instanceSourceLODId | object3DId

export type instancedId = number

export type instancedSource = InstanceSourceLOD | Object3D

export type instancedMesh = InstancedMesh2LOD | InstancedMesh2

export type instance = {
    // sourcesMap: Map<instancedMesh2LODId, Array<InstanceSourceLOD>>,
    // indexMap: Map<instanceSourceLODId, instanceIndex>,
    // instancedMesh2OneMap: Map<instanceSourceLODId, InstancedMesh2LOD>,
    // needUpdateColorMap: Map<instanceSourceLODId, Color>,
    // visibleMap: Map<instanceSourceLODId, boolean>

    isInstancedSourceMap: Map<instancedSourceId, boolean>,
    // sourcesMap: Map<instancedId, Array<InstanceSourceLOD | Mesh>>,
    sourcesMap: Map<instancedId, Array<instancedSource>>,
    sourceWorldBoundingBoxMap: Map<instancedSourceId, Box3>,
    indexMap: Map<instancedSourceId, instanceIndex>,
    instancedMesh2OneMap: Map<instancedSourceId, instancedMesh>,
    needUpdateColorMap: Map<instancedSourceId, Color>,
    visibleMap: Map<instancedSourceId, boolean>
}

export type resourceId = string

type resource = any

export enum resourceType {
    ArrayBuffer,
    Texture
}

export type loader = {
    resourceData: Map<resourceId, resource>
}

export type device = {
    clock: Clock,
    delta: number,
    // width: number,
    // height: number
}

export enum layer {
    // Visible = 1,
    // NotVible = 2,
    Pickable = 3,
}

export type light = {
    directionLightShadowMapViewer: nullable<ShadowMapViewer>
}

export type instancedMesh2LODId = number

type instanceSourceLODId = number

export type level = {
    instancedMesh2s: Array<InstancedMesh2>;
    /** The distance at which to display this level of detail. Expects a `Float`. */
    distance: number;
    /** Threshold used to avoid flickering at LOD boundaries, as a fraction of distance. Expects a `Float`. */
    hysteresis: number;
}

export type lod = {
    instancedMesh2LevelsMap: Map<instancedMesh2LODId, Array<level>>,
    // bvhMap: Map<instancedMesh2LODId, InstancedMeshBVH>,

}

export type config = {
    isDebug: boolean,
}

export type deferExecFuncData<specificState> = {
    func: (specificState: specificState) => Promise<specificState>,
    loopCount: number
}

export type flow = {
    isStopLoop: boolean,
    // loopIndex:number,
    deferExecFuncs: List<deferExecFuncData<any>>
}

export type state = {
    config: config,
    device: device,
    flow: flow,
    render: nullable<render>,
    scene: scene,
    pick: pick
    articluatedAnimation: articluatedAnimation
    skinAnimation: skinAnimation,
    event: event
    stats: nullable<stats>,
    loader: loader,
    instance: instance,
    lod: lod,
    light: light,
}