import { state } from "../../../../../../type/StateType"
import { getIsDebug } from "../../../../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { CSG } from "meta3d-jiehuo-abstract"
import { getCabinetColor } from "../../BuildCabinetUtils"

export let getWidth = () => 12

export let getHeight = () => 1.1

export let getDepth = () => 9

export let getColor = () => getCabinetColor().multiplyScalar(1.4)

// export let getMetalness = () => 0.99

// export let getRoughness = () => 0.6

// let _buildMouth = (state: state, material) => {
//     let body = NewThreeInstance.createMesh(
//         // NewThreeInstance.createBoxGeometry(2, 1, 3.9),
//         // NewThreeInstance.createBoxGeometry(1, 1 / 12, 1 / 12),
//         NewThreeInstance.createBoxGeometry(1, 1 / 3, 0.1),
//         material
//     )
//     // let hole = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(1 * 0.8, 1 / 3 * 0.8, 0.1))
//     // hole.position.set(0, 0, 1 / 3 * 0.2+0.5)

//     // Make sure the .matrix of each mesh is current
//     // body.updateMatrix()
//     // hole.updateMatrix()

//     // let result = CSG.subtract(body, hole)
//     let result = body

//     return result
// }

// export let build = (state: state, material) => {
//     let body = NewThreeInstance.createMesh(
//         // NewThreeInstance.createBoxGeometry(2, 1, 3.9),
//         NewThreeInstance.createBoxGeometry(getWidth(), getHeight(), getDepth()),
//         material
//     )
//     // let hole = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(1.9, 0.9, 3.8),)
//     let hole = NewThreeInstance.createMesh(NewThreeInstance.createBoxGeometry(getWidth() - 0.1, getHeight() - 0.1, getDepth() - 0.1),)
//     hole.position.set(0, 0.1, 0)




//     let mouse1 = _buildMouth(state, material)
//     let mouse2 = mouse1.clone()

//     mouse1.position.set(-3, 0, 4.5)
//     mouse2.position.set(3, 0, 4.5)



//     // // Make sure the .matrix of each mesh is current
//     // body.updateMatrix()
//     // hole.updateMatrix()

//     // mouse1.updateMatrix()
//     // mouse2.updateMatrix()

//     if (getIsDebug(state)) {
//         return CSG.createDebugObject(body, [hole, mouse1, mouse2])
//     }

//     let result = CSG.subtracts(body, [hole, mouse1, mouse2])


//     result.castShadow = false
//     result.receiveShadow = true

//     return result
// }