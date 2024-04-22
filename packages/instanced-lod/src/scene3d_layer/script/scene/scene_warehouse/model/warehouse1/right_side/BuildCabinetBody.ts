import { Mesh, BoxGeometry, MeshPhysicalMaterial, Color, Object3D, MeshStandardMaterial } from "three"
import { state } from "../../../../../../type/StateType"
import { getIsDebug } from "../../../../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { CSG } from "meta3d-jiehuo-abstract"

export let getConfig = () => {
    return {
        drawerWidth: 12,
        drawerHeight: 1.1,
        drawerDepth: 9,
        gap_up: 0.4,
        gap_middle: 0.5,
        gap_down: 1.3,
        gap_left: 1.2,
        gap_right: 1.2,
        bottom: 0.5,
        block_row_count: 4,
        drawer_block_count: 10,
    }
}

export let getWidth = () => {
    let {
        drawerWidth,
        drawerHeight,
        drawerDepth,
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        bottom,
        block_row_count,
        drawer_block_count,
    } = getConfig()

    return gap_left + gap_right + gap_middle * (block_row_count - 1) + drawerWidth * block_row_count
}

export let getHeight = () => {
    let {
        drawerWidth,
        drawerHeight,
        drawerDepth,
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        bottom,
        block_row_count,
        drawer_block_count,
    } = getConfig()

    return gap_up + gap_down + bottom + (2 * drawer_block_count + 1) * drawerHeight
}

export let getDepth = () => 9.4

export let getBlockWidth = () => {
    return getConfig().drawerWidth
}

export let getBlockHeigth = () => {
    let {
        drawerHeight,
        drawer_block_count,
    } = getConfig()

    return drawer_block_count * drawerHeight
}

export let build = (state: state, material) => {
    let {
        drawerWidth,
        drawerHeight,
        drawerDepth,
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        bottom,
        block_row_count,
        drawer_block_count,
    } = getConfig()

    let bodyWidth = getWidth()
    let bodyHeight = getHeight()
    let bodyDepth = getDepth()

    let body = NewThreeInstance.createMesh(
        // NewThreeInstance.createBoxGeometry(51.9, 27.5, 9.4),
        NewThreeInstance.createBoxGeometry(bodyWidth, bodyHeight, bodyDepth),
        material
    )

    let holeWidth = getBlockWidth()
    let holeHeight = getBlockHeigth()
    let holeDepth = drawerDepth

    // let hole_1 = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(12, 11, 9),)
    let hole_1 = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(holeWidth, holeHeight, holeDepth),)
    let hole_2 = hole_1.clone()
    let hole_3 = hole_1.clone()
    let hole_4 = hole_1.clone()
    let hole_5 = hole_1.clone()
    let hole_6 = hole_1.clone()
    let hole_7 = hole_1.clone()
    let hole_8 = hole_1.clone()

    hole_1.position.set((bodyWidth - holeWidth) / 2 - gap_right, (bodyHeight - holeHeight) / 2 - gap_up, bodyDepth - holeDepth)

    hole_2.position.copy(hole_1.position)
    hole_2.translateX(- (holeWidth + gap_middle))

    hole_3.position.copy(hole_2.position)
    hole_3.translateX(- (holeWidth + gap_middle))

    hole_4.position.copy(hole_3.position)
    hole_4.translateX(- (holeWidth + gap_middle))

    hole_5.position.copy(hole_1.position)
    hole_5.translateY(- (holeHeight + drawerHeight))

    hole_6.position.copy(hole_5.position)
    hole_6.translateX(- (holeWidth + gap_middle))

    hole_7.position.copy(hole_6.position)
    hole_7.translateX(- (holeWidth + gap_middle))

    hole_8.position.copy(hole_7.position)
    hole_8.translateX(- (holeWidth + gap_middle))



    let hole_bottom = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(bodyWidth - 2, bottom, bodyDepth),)
    hole_bottom.position.set(0, - (bodyHeight - bottom) / 2, 0)

    // Make sure the .matrix of each mesh is current
    // body.updateMatrix()
    // hole_1.updateMatrix()
    // hole_2.updateMatrix()
    // hole_3.updateMatrix()
    // hole_4.updateMatrix()
    // hole_5.updateMatrix()
    // hole_6.updateMatrix()
    // hole_7.updateMatrix()
    // hole_8.updateMatrix()
    // hole_bottom.updateMatrix()

    if (getIsDebug(state)) {
        return CSG.createDebugObject(body, [hole_1, hole_2, hole_3, hole_4, hole_5, hole_6, hole_7, hole_8, hole_bottom])
    }


    let result = CSG.subtracts(body, [hole_1, hole_2, hole_3, hole_4, hole_5, hole_6, hole_7, hole_8, hole_bottom])


    result.castShadow = true
    result.receiveShadow = true

    return result
}