import { Mesh, BoxGeometry, MeshPhysicalMaterial, Color, Object3D, PlaneGeometry, Texture, SRGBColorSpace, RepeatWrapping } from "three"
import { state } from "../../../../../type/StateType"
import { getIsDebug } from "../../../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import * as BuildRightSideCabinet from "./right_side/BuildCabinet"
import * as BuildLeftSideCabinet from "./left_side/BuildCabinet"
import * as BuildWarehouseUtils from "../BuildWarehouseUtils"
import { Loader } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../state/State"
import { getTileTextureResourceId } from "../../WarehouseScene"

export let getDistanceOfRightSideToRightWall = () => 26

export let getDistanceBetweenRightSideAndLeftSide = () => 35

export let getDistanceOfLeftSideToLeftWall = () => 0

export let getDistanceOfFirstToDoor = () => 35

export let getDistanceOfRightSideLastToDoor = () => 42

export let getDistanceOfLeftSideLastToDoor = () => 37

export let getConfig = () => {
    let gap_right = getDistanceOfRightSideToRightWall()
    let gap_left = getDistanceOfLeftSideToLeftWall()
    let gap_middle = getDistanceBetweenRightSideAndLeftSide()

    return {
        width: gap_right + gap_left + gap_middle + BuildRightSideCabinet.getWidth() + BuildLeftSideCabinet.getWidth(),
        height: BuildRightSideCabinet.getHeight() + 12,
        depth: 255,
        thickness: 3,
        doorWidth: 20
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
    let wallMaterial = NewThreeInstance.createMeshPhysicalMaterial({
        color: new Color(0xffffff),
        metalness: 0.1,
        roughness: 0.9
    })

    let groundTexture = Loader.getResource<Texture>(getAbstractState(state), getTileTextureResourceId()).clone()
    groundTexture.colorSpace = SRGBColorSpace;
    groundTexture.wrapS = RepeatWrapping
    groundTexture.wrapT = RepeatWrapping
    groundTexture.repeat.set(6, 10)
    // wallSideTexture.rotation = Math.PI / 2



    return BuildWarehouseUtils.build(state, getConfig(),
        NewThreeInstance.createMeshPhysicalMaterial({
            // color: new Color(0x7F8274),
            map:groundTexture,
            metalness: 0.0,
            roughness: 0.8,
        }),
        {
            wallFrontMaterial: wallMaterial,
            wallBackMaterial: wallMaterial,
            wallLeftMaterial: wallMaterial,
            wallRightMaterial: wallMaterial,
        }
    )
}