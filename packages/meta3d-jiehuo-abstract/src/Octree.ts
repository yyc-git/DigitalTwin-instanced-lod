// import { Octree } from "three/examples/jsm/math/Octree"
import { Octree } from "./three/Octree"
// import type { Capsule } from "three/examples/jsm/math/Capsule"
import { Object3D, Object3DEventMap } from "three"
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { Capsule } from "three/examples/jsm/math/Capsule";

class FakeGroup extends Object3D {
    constructor() {
        super();
    }

    add(...objects: Object3D<Object3DEventMap>[]): this {
        this.children = objects

        return this
    }
}

export let create = (maxLevel) => {
    let octree = new Octree()

    octree.maxLevel = maxLevel

    return octree
}

let _fromGraphNodes = (octree: Octree, nodes: Array<Object3D>) => {
    if (nodes.length == 0) {
        return
    }

    // octree.fromGraphNode(new Object3D().add(...nodes))
    octree.fromGraphNode(new FakeGroup().add(...nodes))
}

export let capsuleIntersect = (octree: Octree, capsule: Capsule) => {
    return octree.capsuleIntersect(capsule)
}

export let reset = (octree, maxLevel) => {
    return create(maxLevel)
}

export let build = (scene, octree: Octree, nodes: Array<Object3D>, isDebug): [Object3D, Octree] => {
    _fromGraphNodes(octree, nodes)

    if (isDebug) {
        let octreeHelper = new OctreeHelper(octree, 0xff0)
        scene.add(octreeHelper)
    }

    return [scene, octree]
}