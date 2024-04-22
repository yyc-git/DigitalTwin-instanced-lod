import { Vector3, CapsuleGeometry, MeshBasicMaterial, Mesh } from "three"
import { Capsule } from "three/examples/jsm/math/Capsule"

export let create = (start = new Vector3(0, 0, 0), end = new Vector3(0, 1, 0), radius = 1) => {
    return new Capsule(start, end, radius)
}

export let createCapsuleMesh = ({
    radius = 1, length = 1, capSegments = 4, radialSegments = 8
}, color = "red") => {
    let geometry = new CapsuleGeometry(radius, length, capSegments, radialSegments,)

    let material = new MeshBasicMaterial({ color: color })

    return new Mesh(geometry, material)
}