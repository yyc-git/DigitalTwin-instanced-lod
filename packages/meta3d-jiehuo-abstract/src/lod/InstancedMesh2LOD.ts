import { Camera, Color, Frustum, InstancedMesh, Material, Matrix4, OrthographicCamera, PerspectiveCamera, Vector3 } from "three"
import { instancedMesh2LODId, lod, state } from "../type/StateType"
import * as InstanceSourceLOD from "./InstanceSourceLOD"
import { CullingNone, CullingStatic, InstancedMesh2, InstancedMesh2Params } from "../instance/InstancedMesh2"
import { Map } from "immutable"
import { getLODState, setLODState } from "../state/State"
import { getExn } from "../utils/NullableUtils"
import { findAllSources, getIndex, getWorldBoundingBox, isVisible } from "../instance/Instance"
// import { InstancedMeshBVH } from "../instance/InstancedMeshBVH"

// export type level = {
//     // instancedMesh2: InstancedMesh2;
//     instancedMesh2s: Array<InstancedMesh2>;
//     /** The distance at which to display this level of detail. Expects a `Float`. */
//     distance: number;
//     /** Threshold used to avoid flickering at LOD boundaries, as a fraction of distance. Expects a `Float`. */
//     hysteresis: number;
// }

export class InstancedMesh2LOD extends InstancedMesh {
    readonly isInstancedMesh2LOD = true

    // constructor(...params){
    //     super(...params)
    // }
}

export let create = (state: state, levels: Array<InstanceSourceLOD.level>, count: number, config: InstancedMesh2Params<any>): [state, InstancedMesh2LOD] => {
    let instancedMesh2Levels = levels.sort((a, b) => {
        return a.distance - b.distance
    }).reduce((instancedMesh2Levels, level) => {
        instancedMesh2Levels.push({
            instancedMesh2s: InstanceSourceLOD.getLevelMeshs(level).reduce((instancedMesh2s, { geometry, material }) => {
                instancedMesh2s.push(new InstancedMesh2(geometry, material as Material, count, config))

                return instancedMesh2s
            }, []),
            distance: level.distance,
            hysteresis: level.hysteresis
        })

        return instancedMesh2Levels
    }, [])

    // let { geometry, material } = instancedMesh2Levels[0].instancedMesh2

    // let mesh = new InstancedMesh2LOD(geometry, material, count)
    // let mesh = new InstancedMesh2LOD(geometry, material, 0)
    let mesh = new InstancedMesh2LOD(null, null, 0)

    state = setLODState(state, {
        ...getLODState(state),
        instancedMesh2LevelsMap: getLODState(state).instancedMesh2LevelsMap.set(mesh.id, instancedMesh2Levels)
    })

    return [state, mesh]
}

let _getInstancedMesh2Levels = (state: state, id: instancedMesh2LODId) => {
    return getExn(getLODState(state).instancedMesh2LevelsMap.get(id))
}

// let _getBehaviour = (state: state, mesh: InstancedMesh2LOD) => {
//     return _getInstancedMesh2Levels(state, mesh.id)[0].instancedMesh2.config.behaviour
// }

let _getInstancedMesh2ForCulling = (state: state, id: instancedMesh2LODId) => {
    return _getInstancedMesh2Levels(state, id)[0].instancedMesh2s[0]
}

let _getAllInstancedMesh2s = (state: state, id: instancedMesh2LODId) => {
    return getExn(getLODState(state).instancedMesh2LevelsMap.get(id)).map((level) => level.instancedMesh2s)
}

export let setName = (mesh: InstancedMesh2LOD, name) => {
    mesh.name = name

    return mesh
}

export let setShadow = (mesh: InstancedMesh2LOD, state, castShadow, receiveShadow) => {
    _getAllInstancedMesh2s(state, mesh.id).forEach(instancedMesh2s => {
        instancedMesh2s.forEach(instancedMesh2 => {
            instancedMesh2.castShadow = castShadow
            instancedMesh2.receiveShadow = receiveShadow
        })
    })

    return mesh
}

export let setLayer = (mesh: InstancedMesh2LOD, state, setLayerFunc) => {
    _getAllInstancedMesh2s(state, mesh.id).forEach(instancedMesh2s => {
        instancedMesh2s.forEach(instancedMesh2 => {
            setLayerFunc(instancedMesh2.layers)
        })
    })

    return mesh
}

export let addToScene = (scene, state, mesh: InstancedMesh2LOD) => {
    mesh.visible = false

    scene.add(mesh)

    return _getInstancedMesh2Levels(state, mesh.id).reduce((scene, level) => {
        level.instancedMesh2s.forEach(instancedMesh2 => {
            instancedMesh2.frustumCulled = false
        })

        scene.add(...level.instancedMesh2s)

        return scene
    }, scene)
}

// export let build = (state: state, mesh: InstancedMesh2LOD) => {
//     let behaviour = _getBehaviour(state, mesh)
//     let instancedMesh2 = _getInstancedMesh2ForCulling(state, mesh.id)

//     // if (this._perObjectFrustumCulled) {
//     if (instancedMesh2.getPerObjectFrustumCulled()) {
//         //   this.frustumCulled = false; // todo gestire a true solamente quando count è 0 e mettere bbox 

//         if (behaviour === CullingStatic) {
//             // let bvh = new InstancedMeshBVH(instancedMesh2).build(state, mesh);

//             // state = setLODState(state, {
//             //     ...getLODState(state),
//             //     bvhMap: getLODState(state).bvhMap.set(mesh.id, bvh)
//             // })
//         }
//         //  else if (!instancedMesh2.geometry.boundingSphere) {
//         //     instancedMesh2.geometry.computeBoundingSphere();
//         // }
//     }

//     return state
// }


let _computeDistance = (cameraPosition, instancePosition, cameraZoom) => {
    return cameraPosition.distanceTo(instancePosition) / cameraZoom
}

let _hide = (state: state, id, index: number) => {
    _getInstancedMesh2Levels(state, id).forEach(level => {
        level.instancedMesh2s.forEach(instancedMesh2 => {
            instancedMesh2.hide(index)
        })
    })
}

let _show = (state: state, id, index: number, cameraPosition: Vector3, cameraZoom: number, instancePosition: Vector3) => {
    let distance_ = _computeDistance(cameraPosition, instancePosition, cameraZoom)

    _getInstancedMesh2Levels(state, id).reduce((isFindShowLevel, level) => {
        if (isFindShowLevel) {
            level.instancedMesh2s.forEach(instancedMesh2 => {
                instancedMesh2.hide(index)
            })

            return isFindShowLevel
        }

        if (distance_ < level.distance) {
            level.instancedMesh2s.forEach(instancedMesh2 => {
                instancedMesh2.show(index)
            })

            return true
        }

        level.instancedMesh2s.forEach(instancedMesh2 => {
            instancedMesh2.hide(index)
        })

        return false
    }, false)
}

export let updateCulling = (state: state, mesh: InstancedMesh2LOD, camera: Camera) => {
    if (!_getInstancedMesh2ForCulling(state, mesh.id).getPerObjectFrustumCulled()) {
        return
    }

    // let levelsData = _getInstancedMesh2Levels(state, mesh.id).reduce((result, level) => {
    //     level.instancedMesh2.handleBeforeUpdateCulling()

    //     let [show, hide] = level.instancedMesh2.getShowAndHideForCulling()

    //     result.push(
    //         [
    //             show,
    //             hide,
    //             level.distance,
    //             level.hysteresis
    //         ]
    //     )

    //     return result
    // }, [])

    // let bvh = getExn(getLODState(state).bvhMap.get(mesh.id))

    // bvh.updateCulling(camera as any, levelsData)





    _getAllInstancedMesh2s(state, mesh.id).forEach(instancedMesh2s => {
        instancedMesh2s.forEach(instancedMesh2 => {
            instancedMesh2.handleBeforeUpdateCulling()
        })
    })


    let projScreenMatrix = new Matrix4()
    let frustum = new Frustum()

    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(projScreenMatrix);

    let worldPosition = new Vector3()

    let cameraPosition = new Vector3().setFromMatrixPosition(camera.matrixWorld)
    let cameraZoom = (camera as any).zoom

    findAllSources<InstanceSourceLOD.InstanceSourceLOD>(state, mesh.id).forEach(sourceLOD => {
        worldPosition = sourceLOD.getWorldPosition(worldPosition)

        let index = getIndex(state, sourceLOD)

        if (!isVisible(state, sourceLOD)) {
            _hide(state, mesh.id, index)
            return
        }

        if (frustum.intersectsBox(getWorldBoundingBox(state, sourceLOD))) {
            _show(state, mesh.id, index, cameraPosition, cameraZoom, worldPosition)
        }
        else {
            _hide(state, mesh.id, index)
        }
    })

    _getAllInstancedMesh2s(state, mesh.id).forEach(instancedMesh2s => {
        instancedMesh2s.forEach(instancedMesh2 => {
            instancedMesh2.updateVisible()
        })
    })
}

export let setMatrixWorld = (state: state, mesh: InstancedMesh2LOD, index: number, matrixWorld: Matrix4) => {
    _getInstancedMesh2Levels(state, mesh.id).forEach(({ instancedMesh2s }) => {
        instancedMesh2s.forEach(instancedMesh2 => {
            instancedMesh2.setMatrixWorld(index, matrixWorld)
        })
    })
}

export let setColor = (state: state, mesh: InstancedMesh2LOD, index: number, color: Color) => {
    _getInstancedMesh2Levels(state, mesh.id).forEach(({ instancedMesh2s }) => {
        instancedMesh2s.forEach(instancedMesh2 => {
            instancedMesh2.setColor(index, getExn(color))
        })
    })
}