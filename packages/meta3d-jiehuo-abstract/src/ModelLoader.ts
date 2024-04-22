import type { Object3D } from "three"
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { state } from "./type/StateType"

export let parseGlb = (state: state, glb: ArrayBuffer, renderer): Promise<Object3D> => {
    let dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("three/draco/gltf/")

    let ktx2Loader = new KTX2Loader()
        .setTranscoderPath("three/basis/")
        .detectSupport(renderer)

    return new Promise((resolve, reject) => {
        new GLTFLoader(
            // DefaultLoadingManager as any,
        ).setDRACOLoader(dracoLoader)
            .setMeshoptDecoder(MeshoptDecoder)
            .setKTX2Loader(ktx2Loader)
            // .register(Meta3DCameraActive.getExtension)
            // .register(Meta3DCameraController.getExtension)
            // .register(Meta3DScript.getExtension)
            .parse(
                glb,
                "",
                (gltf) => {
                    // resolve(gltf.scene.children[0])
                    resolve(gltf.scene)
                },
                (event) => reject(event)
            )
    })
}

export let parseFbx = (state: state, fbx: ArrayBuffer, path: string): Promise<Object3D> => {
    return new Promise((resolve, reject) => {
        resolve(new FBXLoader().parse(fbx, path))
    })
}