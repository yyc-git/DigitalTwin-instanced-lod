import { Mesh, BoxGeometry, MeshPhysicalMaterial, Color, Object3D, PlaneGeometry } from "three"
import { state } from "../../../../type/StateType"
import { getIsDebug } from "../../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Scene } from "meta3d-jiehuo-abstract"
import { getScene } from "../WarehouseScene"

let _getWallName = () => "wall"

let _getDoorName = () => "door"

export let findAllWallsAndDoors = (state: state) => {
    return Scene.findObjects(getScene(state), obj => {
        return obj.name == _getWallName() || obj.name == _getDoorName()
    })
}

export let build = (state: state, { width, depth, height, thickness, doorWidth }, groundMaterial, {
    wallFrontMaterial,
    wallBackMaterial,
    wallLeftMaterial,
    wallRightMaterial,
}) => {
    let ground = NewThreeInstance.createMesh(
        NewThreeInstance.createPlaneGeometry(width, depth, 1, 1),
        groundMaterial
    )

    ground.rotateX(-Math.PI / 2)
    ground.position.setY(-height / 2)

    ground.receiveShadow = true


    let wallLeft = NewThreeInstance.createMesh(
        NewThreeInstance.createBoxGeometry(thickness, height, depth),
        wallLeftMaterial
    )
    wallLeft.name = _getWallName()
    let wallRight = wallLeft.clone()
    wallRight.material = wallRightMaterial
    wallRight.name = _getWallName()

    let wallFrontWidth = (width - 2 * doorWidth) / 2
    let wallFrontLeft = NewThreeInstance.createMesh(
        NewThreeInstance.createBoxGeometry(wallFrontWidth, height, thickness),
        wallFrontMaterial
    )
    wallFrontLeft.name = _getWallName()
    let wallFrontRight = wallFrontLeft.clone()
    wallFrontRight.name = _getWallName()

    let wallBackWidth = wallFrontWidth
    let wallBackLeft = wallFrontLeft.clone()
    wallBackLeft.material = wallBackMaterial
    wallBackLeft.name = _getWallName()
    let wallBackRight = wallFrontLeft.clone()
    wallBackRight.name = _getWallName()


    let doorMaterial = NewThreeInstance.createMeshPhysicalMaterial({
        color: new Color(0x4d3900),
        metalness: 0.1,
        roughness: 0.9
    })

    let doorFrontLeft = NewThreeInstance.createMesh(
        NewThreeInstance.createBoxGeometry(doorWidth, height, thickness),
        doorMaterial
    )
    doorFrontLeft.name = _getDoorName()
    let doorFrontRight = doorFrontLeft.clone()
    doorFrontRight.name = _getDoorName()
    let doorBackLeft = doorFrontLeft.clone()
    doorBackLeft.name = _getDoorName()
    let doorBackRight = doorFrontLeft.clone()
    doorBackRight.name = _getDoorName()




    wallFrontLeft.position.set(-(width - wallFrontWidth) / 2, 0, depth / 2)
    doorFrontLeft.position.set(-doorWidth / 2, 0, depth / 2)
    wallFrontRight.position.set((width - wallFrontWidth) / 2, 0, depth / 2)
    doorFrontRight.position.set(doorWidth / 2, 0, depth / 2)


    wallBackLeft.position.set(-(width - wallBackWidth) / 2, 0, -depth / 2)
    doorBackLeft.position.set(-doorWidth / 2, 0, -depth / 2)
    wallBackRight.position.set((width - wallBackWidth) / 2, 0, -depth / 2)
    doorBackRight.position.set(doorWidth / 2, 0, -depth / 2)


    wallLeft.translateX(-width / 2)
    wallRight.translateX(width / 2)




    let warehouse = NewThreeInstance.createObject3D()
    warehouse.add(ground, wallFrontLeft, wallFrontRight, wallBackLeft, wallBackRight, wallLeft, wallRight, doorFrontLeft, doorFrontRight, doorBackLeft, doorBackRight)


    warehouse.translateY(height / 2)

    return warehouse
}