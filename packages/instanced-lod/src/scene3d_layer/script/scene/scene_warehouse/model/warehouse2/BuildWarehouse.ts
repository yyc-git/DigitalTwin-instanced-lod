import { Mesh, BoxGeometry, MeshPhysicalMaterial, Color, Object3D, PlaneGeometry, SRGBColorSpace, Texture, RepeatWrapping, MirroredRepeatWrapping } from "three"
import { state } from "../../../../../type/StateType"
import { getIsDebug } from "../../../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import * as BuildCabinet from "./BuildCabinet"
import { Scene } from "meta3d-jiehuo-abstract"
import { getScene, getWoordTextureResourceId } from "../../WarehouseScene"
import * as BuildWarehouseUtils from "../BuildWarehouseUtils"
import { Loader } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../state/State"

export let getDistanceOfFirstToDoor = () => 5

export let getConfig = () => {
    return {
        width: 64,
        height: BuildCabinet.getHeight() + 12,
        depth: 236,
        thickness: 3,
        doorWidth: 13
    }
}

export let getWidth = () => {
    return getConfig().width
}

export let getDepth = () => {
    return getConfig().depth
}

export let getThickness = () => {
    return getConfig().thickness
}

export let build = (state: state) => {
    let texture = Loader.getResource<Texture>(getAbstractState(state), getWoordTextureResourceId()).clone()
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(15, 6)
    texture.rotation = Math.PI / 2

    let wallSideTexture = Loader.getResource<Texture>(getAbstractState(state), getWoordTextureResourceId()).clone()
    wallSideTexture.colorSpace = SRGBColorSpace;
    wallSideTexture.wrapS = RepeatWrapping
    wallSideTexture.wrapT = RepeatWrapping
    wallSideTexture.repeat.set(6, 15)
    wallSideTexture.rotation = Math.PI / 2

    let wallForwardBackTexture = Loader.getResource<Texture>(getAbstractState(state), getWoordTextureResourceId()).clone()
    wallForwardBackTexture.colorSpace = SRGBColorSpace;
    wallForwardBackTexture.wrapS = RepeatWrapping
    wallForwardBackTexture.wrapT = RepeatWrapping
    wallForwardBackTexture.repeat.set(2, 2)
    // wallForwardBackTexture.rotation = Math.PI / 2



    let groundMaterial = NewThreeInstance.createMeshPhysicalMaterial({
        metalness: 0.1,
        roughness: 0.5,
        map: texture
    })

    let wallSideMaterial = NewThreeInstance.createMeshPhysicalMaterial({
        metalness: 0.1,
        roughness: 0.5,
        map: wallSideTexture
    })
    let wallFrontBackMaterial = NewThreeInstance.createMeshPhysicalMaterial({
        metalness: 0.1,
        roughness: 0.5,
        map: wallForwardBackTexture
    })


    return BuildWarehouseUtils.build(state, getConfig(), groundMaterial, {
        wallFrontMaterial: wallFrontBackMaterial,
        wallBackMaterial: wallFrontBackMaterial,
        wallLeftMaterial: wallSideMaterial,
        wallRightMaterial: wallSideMaterial,
    })
}