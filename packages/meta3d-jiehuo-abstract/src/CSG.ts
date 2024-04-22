import { Color, Mesh } from "three";
import { CSG } from 'three-csg-ts'
import { createMeshPhysicalMaterial, createObject3D } from "./NewThreeInstance";

export let subtracts = (source: Mesh, targets: Array<Mesh>) => {
    source.updateMatrix()

    return targets.reduce((result, target) => {
        target.updateMatrix()

        return CSG.subtract(result, target)
    }, source)
}

export let createDebugObject = (source: Mesh, targets: Array<Mesh>) => {
    return targets.reduce((result, object) => {
        object.material = createMeshPhysicalMaterial({
            color: new Color("blue"),
            metalness: 0.6,
            roughness: 0.1
        })

        result.add(object)

        return result
    }, createObject3D().add(source))
}