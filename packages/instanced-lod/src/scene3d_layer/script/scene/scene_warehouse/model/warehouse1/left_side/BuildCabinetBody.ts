import { Color } from "three"
import { state } from "../../../../../../type/StateType"
import { getIsDebug } from "../../../../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { CSG } from "meta3d-jiehuo-abstract"

// 宽50长155*3  高252

export let getConfig = () => {
    return {
        gap_up: 0.4,
        gap_middle: 1,
        gap_down: 1.3,
        gap_left: 1.2,
        gap_right: 1.2,
        holeFrontDepth: 1.5,
        bottom: 0.5,
        blockCount: 3,
        bodyHeight: 25.2,
        // bodyWidth: 15.5 * 3 - gap_left - gap_right - 2 * gap_middle ,
        bodyDepth: 5,
        holeBackWidth: 15.5,
    }
}

export let getWidth = () => {
    let {
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        holeFrontDepth,
        bottom,
        blockCount,
        bodyHeight,
        holeBackWidth,
        bodyDepth,
    } = getConfig()

    return holeBackWidth * blockCount + gap_left + gap_right + 2 * gap_middle
}

export let getHeight = () => {
    return getConfig().bodyHeight
}

export let getDepth = () => {
    return getConfig().bodyDepth
}

// export let getHoleFrontDepth = () => {
//     return getConfig().holeFrontDepth
// }

export let getHoleBackDepth = () => {
    let {
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        holeFrontDepth,
        bottom,
        blockCount,
        bodyHeight,
        holeBackWidth,
        bodyDepth,
    } = getConfig()

    return  bodyDepth - holeFrontDepth - 0.1
}

export let build = (state: state, material) => {
    let {
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        holeFrontDepth,
        bottom,
        blockCount,
        bodyHeight,
        holeBackWidth,
        bodyDepth,
    } = getConfig()

    let bodyWidth = getWidth()

    let body = NewThreeInstance.createMesh(
        NewThreeInstance.createBoxGeometry(bodyWidth, bodyHeight, bodyDepth),
        material
    )

    let holeBottom = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(bodyWidth - gap_left - gap_right, bottom, bodyDepth))
    let holeFront = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(bodyWidth - gap_left - gap_right, bodyHeight - gap_up - gap_down - bottom, holeFrontDepth))


    // let holeBackWidth = (bodyWidth - gap_left - gap_right - 2 * gap_middle) / blockCount


    let holeBackDepth = getHoleBackDepth()

    let holeBack1 = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(holeBackWidth, bodyHeight - gap_up - gap_down - bottom, holeBackDepth))
    let holeBack2 = holeBack1.clone()
    let holeBack3 = holeBack1.clone()

    holeBottom.position.set(0, - (bodyHeight - bottom) / 2, 0)

    holeFront.position.set(0, 0, (bodyDepth - holeFrontDepth) / 2)

    let holeBackZ = (bodyDepth - holeBackDepth - holeFrontDepth) / 2
    holeBack1.position.set(- (holeBackWidth + gap_middle), 0, holeBackZ)
    holeBack2.position.set(0, 0, holeBackZ)
    holeBack3.position.set((holeBackWidth + gap_middle), 0, holeBackZ)

    if (getIsDebug(state)) {
        return CSG.createDebugObject(body, [holeFront, holeBack1, holeBack2, holeBack3, holeBottom])
    }


    let result = CSG.subtracts(body, [holeFront, holeBack1, holeBack2, holeBack3, holeBottom])


    result.castShadow = true
    result.receiveShadow = true

    return result
}