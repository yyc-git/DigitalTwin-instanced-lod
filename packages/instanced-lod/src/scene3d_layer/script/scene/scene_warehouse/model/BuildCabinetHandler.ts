import { Mesh, BoxGeometry, MeshPhysicalMaterial, Color, Object3D, BufferGeometry } from "three"
import { state } from "../../../../type/StateType"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Merge } from "meta3d-jiehuo-abstract"

export let getConfig = () => {
    return {
        handRadius: 0.2,
        handHegith: 2.5,
        bodyWidth: 4.5,
        bodyHeight: 0.7,
        bodyDepth: 0.3,
        cicleBottomRadius: 1.2,
        cicleBottomHeight: 0.8,
        cicleUpRadius: 1.2 * 1.05,
        cicleUpHeight: 0.1,
    }
}

export let build = (state: state) => {
    let material1 = NewThreeInstance.createMeshPhysicalMaterial({
        color: new Color(233/255, 233/255, 216/255),
        metalness: 0.9,
        roughness: 0.1
    })
    let material2 = NewThreeInstance.createMeshPhysicalMaterial({
        color: new Color(0x000000),
        metalness: 0.9,
        roughness: 0.1
    })

    let {
        handRadius,
        handHegith,
        bodyWidth,
        bodyHeight,
        bodyDepth,
        cicleBottomRadius,
        cicleBottomHeight,
        cicleUpRadius,
        cicleUpHeight,
    } = getConfig()

    let cicleBottom = NewThreeInstance.createCylinderGeometry(cicleBottomRadius, cicleBottomRadius, cicleBottomHeight)

    let body = NewThreeInstance.createBoxGeometry(bodyWidth, bodyHeight, bodyDepth)
    let hand = NewThreeInstance.createCylinderGeometry(handRadius, handRadius, handHegith)

    let cicleUp = NewThreeInstance.createCylinderGeometry(cicleUpRadius, cicleUpRadius, cicleUpHeight)
    let cicleUpMesh = NewThreeInstance.createMesh(
        cicleUp,
        material2
    )

    body.rotateZ(-Math.PI / 2)
    body.translate(0, bodyWidth / 2, 0)
    hand.rotateX(Math.PI / 2)
    hand.translate(0, handRadius * 2.5, handHegith / 2)

    cicleBottom.rotateX(Math.PI / 2)
    cicleUp.rotateX(Math.PI / 2)
    cicleUp.translate(0, bodyWidth, cicleBottomHeight / 2)
    cicleBottom.translate(0, bodyWidth, 0)


    let mergedGeometry = Merge.mergeGeometries([
        body, hand, cicleBottom
    ])

    let otherMesh = NewThreeInstance.createMesh(
        mergedGeometry,
        material1
    )

    let handle = NewThreeInstance.createObject3D()
    handle.add(otherMesh, cicleUpMesh)

    return handle
}