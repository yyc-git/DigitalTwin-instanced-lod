import type { Mesh, Object3D } from "three"
import { isInstanceSource, setVisible } from "../instance/Instance"

export let isEqualByName = (obj1: Object3D, obj2: Object3D) => {
    return obj1.name == obj2.name
}

export let markAllMeshesNotVisible = (object: Object3D) => {
    if ((object as Mesh).isMesh) {
        // throw new Error("shouldn't be Mesh")

        object.visible = false
    }

    object.traverse(child => {
        if ((child as Mesh).isMesh) {
            child.visible = false
        }
    })
}

export let markAllVisibilty = (state, object: Object3D, visibility) => {
    let newState = state

    object.traverse(obj => {
        if (isInstanceSource(newState, obj)) {
            newState = setVisible(newState, obj, visibility)
        }

        obj.visible = visibility

        return newState
    })

    return newState
}

export let markAllMeshesVisible = (object: Object3D) => {
    if ((object as Mesh).isMesh) {
        throw new Error("shouldn't be Mesh")
    }

    object.traverse(child => {
        if ((child as Mesh).isMesh) {
            child.visible = true
        }
    })
}

export let markNeedsUpdate = <T extends Object3D>(object: T) => {
    object.matrixWorldNeedsUpdate = true
    object.matrixAutoUpdate = true
    object.matrixWorldAutoUpdate = true

    return object
}