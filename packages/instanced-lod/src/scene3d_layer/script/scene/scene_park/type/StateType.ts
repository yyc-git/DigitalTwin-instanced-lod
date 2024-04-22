import type { WebGLRenderer, Object3D, Camera, Vector2, Raycaster, InstancedMesh, Scene, Group, Vector3, Mesh, PerspectiveCamera, OrthographicCamera, Texture } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import type { Map } from "immutable"
import type { Capsule } from "three/examples/jsm/math/Capsule"
import type { Octree } from "meta3d-jiehuo-abstract/src/three/Octree"
import type { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { cameraType } from "../../../../type/StateType"

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

export type tree = {
    tree1: nullable<Object3D>
}

export type animated = {
    box: nullable<Object3D>
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

export type parkScene = {
    isFirstEnter:boolean,
    scene: nullable<Object3D>,
    sceneNumber: number,
    staticGroup: nullable<Group>,
    dynamicGroup: nullable<Group>,
    cameraType: cameraType,
    orbitControlsConfig: nullable<orbitControlsConfig>,
    thirdPersonControlsConfig: nullable<thirdPersonControlsConfig>,
    octree: Octree,
    octreeHelper: nullable<OctreeHelper>,
    girl: girl,
    tree: tree,
    animated: animated,
}
