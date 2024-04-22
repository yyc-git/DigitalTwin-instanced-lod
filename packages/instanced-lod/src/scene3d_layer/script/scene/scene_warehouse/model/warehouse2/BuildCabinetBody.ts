import { Color } from "three"
import { state } from "../../../../../type/StateType"
import { getIsDebug } from "../../../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { CSG } from "meta3d-jiehuo-abstract"

// 29个柜子

// 长460 宽38.5 高250

export let getConfig = () => {
    return {
        gap_up: 0.5,
        gap_middle: 0.3,
        gap_down: 0.5,
        gap_left: 0.5,
        gap_right: 0.5,
        bottom: 0.5,
        bodyHeight: 25,
        bodyWidth: 46,
        bodyDepth: 3.85,
        // smallHoleHeight:0.3
        // middleHoleHeight:7,
        bigHoleHeight: 10
    }
}

export let getWidth = () => {
    return getConfig().bodyWidth
}

export let getHeight = () => {
    return getConfig().bodyHeight
}

export let getDepth = () => {
    return getConfig().bodyDepth
}

let _getHoleWidth = () => {
    let {
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        bottom,
        bodyHeight,
        bodyWidth,
        bodyDepth,
        bigHoleHeight
    } = getConfig()

    return (bodyWidth - gap_left - gap_right - gap_middle * 3) / 4
}

let _getHoleDepth = () => {
    let {
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        bottom,
        bodyHeight,
        bodyWidth,
        bodyDepth,
        bigHoleHeight
    } = getConfig()

    return bodyDepth
}

let _getSmallHoleHeight = () => {
    let {
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        bottom,
        bodyHeight,
        bodyWidth,
        bodyDepth,
        bigHoleHeight
    } = getConfig()

    return bodyHeight - gap_up - gap_down - bottom - 2 * bigHoleHeight - 2 * gap_middle
}

let _getMiddleHoleHeight = () => {
    let {
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        bottom,
        bodyHeight,
        bodyWidth,
        bodyDepth,
        bigHoleHeight
    } = getConfig()

    return bigHoleHeight - _getSmallHoleHeight() - gap_middle
}

export let build = (state: state, material) => {
    let {
        gap_up,
        gap_middle,
        gap_down,
        gap_left,
        gap_right,
        bottom,
        bodyHeight,
        bodyWidth,
        bodyDepth,
        bigHoleHeight
    } = getConfig()

    let body = NewThreeInstance.createMesh(
        NewThreeInstance.createBoxGeometry(bodyWidth, bodyHeight, bodyDepth),
        material
    )

    let holeBottom = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(bodyWidth - gap_left - gap_right, bottom, bodyDepth))


    let holeWidth = _getHoleWidth()
    let holeDepth = _getHoleDepth()
    let smallHoleHeight = _getSmallHoleHeight()
    let middleHoleHeight = _getMiddleHoleHeight()

    let smallHole = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(holeWidth, smallHoleHeight, holeDepth))
    let middleHole = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(holeWidth, middleHoleHeight, holeDepth))
    let bigHole = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(holeWidth, bigHoleHeight, holeDepth))

    let hole1_1 = smallHole.clone()
    let hole1_2 = middleHole.clone()
    let hole1_3 = hole1_1.clone()
    let hole1_4 = hole1_2.clone()
    let hole1_5 = hole1_1.clone()

    let hole2_1 = smallHole.clone()
    let hole2_2 = bigHole.clone()
    let hole2_3 = middleHole.clone()
    let hole2_4 = smallHole.clone()

    let hole3_1 = smallHole.clone()
    let hole3_2 = bigHole.clone()
    let hole3_3 = bigHole.clone()

    let hole4_1 = smallHole.clone()
    let hole4_2 = bigHole.clone()
    let hole4_3 = bigHole.clone()

    holeBottom.position.set(0, - (bodyHeight - bottom) / 2, 0)

    hole1_1.position.set((bodyWidth - holeWidth) / 2 - gap_right, (bodyHeight - smallHoleHeight) / 2 - gap_up, 0)

    hole1_2.position.copy(hole1_1.position)
    hole1_2.translateY(-(middleHoleHeight + smallHoleHeight) / 2 - gap_middle)

    hole1_3.position.copy(hole1_2.position)
    hole1_3.translateY(-(middleHoleHeight + smallHoleHeight) / 2 - gap_middle)

    hole1_4.position.copy(hole1_3.position)
    hole1_4.translateY(-(middleHoleHeight + smallHoleHeight) / 2 - gap_middle)

    hole1_5.position.copy(hole1_4.position)
    hole1_5.translateY(-(middleHoleHeight + smallHoleHeight) / 2 - gap_middle)



    hole2_1.position.copy(hole1_1.position)
    hole2_1.translateX(-(holeWidth + gap_middle))

    hole2_2.position.copy(hole2_1.position)
    hole2_2.translateY(-(bigHoleHeight + smallHoleHeight) / 2 - gap_middle)

    hole2_3.position.copy(hole2_2.position)
    hole2_3.translateY(-(bigHoleHeight + middleHoleHeight) / 2 - gap_middle)

    hole2_4.position.copy(hole2_3.position)
    hole2_4.translateY(-(middleHoleHeight + smallHoleHeight) / 2 - gap_middle)



    hole3_1.position.copy(hole2_1.position)
    hole3_1.translateX(-(holeWidth + gap_middle))

    hole3_2.position.copy(hole3_1.position)
    hole3_2.translateY(-(bigHoleHeight + smallHoleHeight) / 2 - gap_middle)

    hole3_3.position.copy(hole3_2.position)
    hole3_3.translateY(-(bigHoleHeight + bigHoleHeight) / 2 - gap_middle)




    hole4_1.position.copy(hole3_1.position)
    hole4_1.translateX(-(holeWidth + gap_middle))

    hole4_2.position.copy(hole4_1.position)
    hole4_2.translateY(-(bigHoleHeight + smallHoleHeight) / 2 - gap_middle)

    hole4_3.position.copy(hole4_2.position)
    hole4_3.translateY(-(bigHoleHeight + bigHoleHeight) / 2 - gap_middle)




    if (getIsDebug(state)) {
        return CSG.createDebugObject(body, [holeBottom, hole1_1, hole1_2, hole1_3, hole1_4, hole1_5, hole2_1, hole2_2, hole2_3, hole2_4,
            hole3_1, hole3_2, hole3_3,
            hole4_1, hole4_2, hole4_3
        ])
    }


    let result = CSG.subtracts(body, [holeBottom, hole1_1, hole1_2, hole1_3, hole1_4, hole1_5, hole2_1, hole2_2, hole2_3, hole2_4,
        hole3_1, hole3_2, hole3_3,
        hole4_1, hole4_2, hole4_3
    ])


    result.castShadow = true
    result.receiveShadow = true

    return result
}