import type { WebGLRenderer, Object3D, Camera, Vector2, Raycaster, InstancedMesh, Scene, Group, Vector3, Mesh, PerspectiveCamera, OrthographicCamera, Texture } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import type { Map } from "immutable"
import type { Capsule } from "three/examples/jsm/math/Capsule"
// import type { Octree } from "three/examples/jsm/math/Octree"
import type { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { cameraType } from "../../../../type/StateType"
import type { Octree } from "meta3d-jiehuo-abstract/src/three/Octree"

export type cabinet1 = {
    // drawer: nullable<InstanceSourceLOD>,
    drawer: nullable<Object3D>,
    // animatedDrawer: nullable<Mesh>
    animatedDrawer: nullable<Object3D>
    // articluatedAnimationNames: Map<articluatedAnimationName, Array<string>>
    // playingArticluatedAnimationName: nullable<articluatedAnimationName>
}

export type girl = {
    currentAnimationName: string
    capsule: Capsule,
    capsuleMesh: nullable<Mesh>,
    // lastVelocity: Vector3,
    girl: nullable<Object3D>,
    idle: nullable<Object3D>,
    running: nullable<Object3D>,
    position: Vector3
    // isOnFloor: boolean
}

type name = string

export type operateCabinetMode = {
    // restoredCamera: nullable<Camera>,
    targetCabinet: nullable<Object3D>,
    originScaleOfOtherCabinets: Map<name, Vector3>,
    labelOriginScale: nullable<Vector3>,
    labelOriginPosition: nullable<Vector3>,
    lastCamera: nullable<Camera>,
    lastCameraControls: nullable<any>,
    lastShadowBias: nullable<number>
}

export enum mode {
    Default,
    OpearteCabinet
}

export type orbitControlsConfig = {
    position: Vector3,
    target: Vector3,
    // minDistance:number,
    // maxDistance: number,
}

export type thirdPersonControlsConfig = {
    position: Vector3,
}


export type warehouseScene = {
    isFirstEnter:boolean,
    scene: nullable<Object3D>,
    sceneNumber: number,
    staticGroup: nullable<Group>,
    dynamicGroup: nullable<Group>,
    // perspectiveCamera: PerspectiveCamera,
    // orthographicCamera: OrthographicCamera,
    cameraType: cameraType,
    orbitControlsConfig: nullable<orbitControlsConfig>,
    thirdPersonControlsConfig: nullable<thirdPersonControlsConfig>,
    // staticOctree: Octree,
    // staticOctreeHelper: nullable<OctreeHelper>,
    // dynamicOctree: Octree,
    // dynamicOctreeHelper: nullable<OctreeHelper>,
    octree: Octree,
    octreeHelper: nullable<OctreeHelper>,
    cabinet1: nullable<cabinet1>,
    girl: girl,
    currentMode: mode,
    operateCabinetMode: operateCabinetMode,
    roomEnvironment: nullable<Texture>
}
