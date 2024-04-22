import { Mesh, BoxGeometry, MeshPhysicalMaterial, Color, Object3D, BufferGeometry } from "three"
import { state } from "../../../../type/StateType"
import {Merge, NewThreeInstance } from "meta3d-jiehuo-abstract"

export let getConfig = (depth) => {
    return {
        bottomWidth: 1.2,
        bottomHeight: 0.1,
        bottomDepth: depth,
        sideWidth: 0.2,
        sideHeight: 0.3,
        sideDepth: depth,
        middleWidth: 0.1,
        middleHeight: 0.3,
        middleDepth: depth,
    }
}

export let build = (state: state, depth) => {
    let material = NewThreeInstance.createMeshPhysicalMaterial({
        color: new Color(233 / 255, 233 / 255, 216 / 255),
        metalness: 0.9,
        roughness: 0.1
    })
    let {
        bottomWidth,
        bottomHeight,
        bottomDepth,
        sideWidth,
        sideHeight,
        sideDepth,
        middleWidth,
        middleHeight,
        middleDepth,
    } = getConfig(depth)

    let bottom = NewThreeInstance.createBoxGeometry(bottomWidth, bottomHeight, bottomDepth)
    let left = NewThreeInstance.createBoxGeometry(sideWidth, sideHeight, sideDepth)
    let right = NewThreeInstance.createBoxGeometry(sideWidth, sideHeight, sideDepth)
    let middleLeft = NewThreeInstance.createBoxGeometry(middleWidth, middleHeight, middleDepth)
    let middleRight = NewThreeInstance.createBoxGeometry(middleWidth, middleHeight, middleDepth)

    left.translate(-(bottomWidth - sideWidth) / 2, sideHeight / 2, 0)
    right.translate((bottomWidth - sideWidth) / 2, sideHeight / 2, 0)

    middleLeft.translate(-middleWidth, middleHeight / 2, 0)
    middleRight.translate(middleWidth, middleHeight / 2, 0)

    let mergedGeometry = Merge.mergeGeometries([
        bottom, left, right, middleLeft, middleRight
        //  bottom,middleLeft, middleRight
    ])

    return NewThreeInstance.createMesh(
        mergedGeometry,
        material
    )
}