import { state } from "../../../../../type/StateType";
import { getCurrentMode, getDynamicGroupName, getName, getScene, getState, setState } from "../../WarehouseScene";
import { Map } from "immutable"
// import { getPickState } from "../../../state/State";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State";
import { Instance, ArticluatedAnimation, Scene, Event, State, Object3DUtils, Outline } from "meta3d-jiehuo-abstract";
import { instancedMesh, tween } from "meta3d-jiehuo-abstract/src/type/StateType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Pick } from "meta3d-jiehuo-abstract";
import * as BuildCabinetDrawer from "../../model/warehouse1/right_side/BuildCabinetDrawer"
import { getExitOperateCabinetModeEventName, getShowModalEventName, getEnterOperateCabinetModeEventName, getCabinetDrawerAnimationIsPlayingEventName, getCabinetDrawerAnimationIsStopEventName } from "../../../../../utils/EventUtils"
import { cabinet1, mode } from "../../type/StateType";
import { enterMode } from "../../mode_operate_cabinet/OperateCabinetMode";
import { DoubleSide, Color, Mesh, MeshStandardMaterial, Object3D, Vector3, Material, BoxGeometry } from "three";
import { getBodyOriginName, getCabinetNumber, getOriginName, isCabinet } from "../../Cabinet";
import { getExn, isNullable } from "meta3d-jiehuo-abstract/src/utils/NullableUtils";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { Loader } from "meta3d-jiehuo-abstract";
import { SceneUtils } from "meta3d-jiehuo-abstract";
import { Render } from "meta3d-jiehuo-abstract";
import { ensureCheck } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getIsDebug } from "../../../Scene";

// export let getOriginName = () => "cabinet"

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).cabinet1)
}

let _setState = (state: state, cabinetState: cabinet1) => {
    return setState(state, {
        ...getState(state),
        cabinet1: NullableUtils.return_(cabinetState)
    })
}

export let createState = (): cabinet1 => {
    return {
        drawer: null,
        animatedDrawer: null,
        // playingArticluatedAnimationName: null
    }
}

let _getDrawerOriginName = () => "drawer"


let _getType = () => "type1"

export let buildDrawerInstanceIdOfOnlyCabnetNumber = (cabinetNumber: number) => {
    return `${cabinetNumber}_`
}

export let buildDrawerInstanceId = (cabinetNumber: number, drawerNumber: number) => {
    return `${buildDrawerInstanceIdOfOnlyCabnetNumber(cabinetNumber)}${drawerNumber}`
}

export let buildCabinetBodyName = (cabinetNumber: number) => {
    return `${getBodyOriginName()}_${_getType()}_${cabinetNumber}`
}

export let buildDrawerName = (cabinetNumber: number, drawerNumber: number) => {
    return `${_getDrawerOriginName()}_${cabinetNumber}_${drawerNumber}`
}

export let getNumberFromDrawerName = (drawerName: string): [number, number] => {
    let result = [
        ...drawerName.matchAll(
            /_(\d+)_(\d+)$/g
        )
    ][0]

    return [Number(result[1]), Number(result[2])]
}


let _isDrawerByName = (name) => {
    return name.includes(_getDrawerOriginName())
}

export let isDrawer = (mesh: Mesh) => {
    return _isDrawerByName(mesh.parent.name)
}

let _getDrawer = (mesh: Mesh, state: state) => {
    return ensureCheck(mesh.parent, (r) => {
        test("should be drawer", () => {
            return _isDrawerByName(r.name)
        })
    }, getIsDebug(state))
}

export let findAllDrawers = (scene) => {
    return Scene.findObjects(scene, ({ name }) => _isDrawerByName(name))
}

// let _isFirstCabinet = (name) => {
//     // return name === Instance.addInstanceIdPostfix(getOriginName(), "1")
//     return name === buildCabinetName(1)
// }

// let _isBelongToFirstInstanceCabinet = (name) => {
//     return name.includes(Instance.getInstanceIdPostfix(buildDrawerInstanceIdOfOnlyCabnetNumber(1)))
// }

// let _createArticluatedAnimations = (state: state): [Array<tween>, Array<tween>] => {
//     let meshes = Scene.findObjects(getScene(state), ({ name }) => [
//         // "Drawers_low",
//         // "Handle_low",
//         // "Handle02_low",
//         // "painting_low"
//         _getDrawerOriginName()
//     ].reduce((result, name_) => {
//         // if (result) {
//         //     return result
//         // }

//         // return _isBelongToFirstInstanceCabinet(name) && name == Instance.addInstanceIdPostfix(name_, "1") && !Instance.isInstancedMesh(name)
//         return _isBelongToFirstInstanceCabinet(name) && !Instance.isInstancedMesh(name)
//     }, false))

//     let drawerGoOutArticluatedAnimationTweens = meshes.reduce((tweens, mesh, i) => {
//         let [x, y, z] = mesh.position.toArray()

//         let tween = ArticluatedAnimation.createTween(
//             [
//                 readState,
//                 writeState
//             ],
//             { x, y, z }, {
//             onUpdate: (state, object, elapsed) => {
//                 mesh.position.copy(object)

//                 mesh.matrixWorldNeedsUpdate = true

//                 return Promise.resolve(state)
//             },
//         })
//         // tween = ArticluatedAnimation.to(tween, { x: x, y: y, z: z + 200 }, 3000)
//         tween = ArticluatedAnimation.to(tween, { x: x, y: y, z: z + BuildCabinetDrawer.getDepth() }, 3000)

//         return tweens.concat([tween])
//     }, [])


//     let drawerGoInArticluatedAnimationTweens = meshes.reduce((tweens, mesh, i) => {
//         let [x, y, z] = mesh.position.toArray()

//         let tween = ArticluatedAnimation.createTween(
//             [
//                 readState,
//                 writeState
//             ],
//             { x, y, z: z + BuildCabinetDrawer.getDepth() }, {
//             onUpdate: (state, object, elapsed) => {
//                 mesh.position.copy(object)

//                 mesh.matrixWorldNeedsUpdate = true

//                 return Promise.resolve(state)
//             },
//         })
//         tween = ArticluatedAnimation.to(tween, { x: x, y: y, z: z }, 3000)

//         return tweens.concat([tween])
//     }, [])

//     return [drawerGoOutArticluatedAnimationTweens, drawerGoInArticluatedAnimationTweens]
// }

let _buildGoOutAnimationName = (instanceId: string) => {
    return `drawer_GoOut_${instanceId} `
}

let _buildGoInAnimationName = (instanceId: string) => {
    return `drawer_GoIn_${instanceId} `
}

let _isPlayArticluatedAnimation = (state, articluatedAnimationName) => {
    // return [
    //     "drawer_GoOut",
    //     "drawer_GoIn"
    // ].reduce((isPlaying, articluatedAnimationName) => {
    //     if (isPlaying) {
    //         return true
    //     }

    //     return ArticluatedAnimation.isArticluatedAnimationPlaying(getAbstractState(state), articluatedAnimationName)
    // }, false)


    return ArticluatedAnimation.isArticluatedAnimationPlaying(getAbstractState(state), articluatedAnimationName)
}

let _isAnyDrawerAnimated = (state: state) => {
    return !NullableUtils.isNullable(_getState(state).animatedDrawer)
}

export let judgeAndPlayDrawerGoOutArticluatedAnimation = (state: state, selectedMesh: instancedMesh) => {
    if (isDrawer(selectedMesh) && !_isAnyDrawerAnimated(state)) {
        let drawer = _getDrawer(selectedMesh, state)

        let animationName = _buildGoOutAnimationName(Instance.getInstanceId(drawer.name))

        // let meshes = [drawer]

        // let drawerGoOutArticluatedAnimationTweens = meshes.reduce((tweens, mesh, i) => {
        //     let [x, y, z] = mesh.position.toArray()

        //     let tween = ArticluatedAnimation.createTween(
        //         [
        //             readState,
        //             writeState
        //         ],
        //         { x, y, z }, {
        //         onUpdate: (state, object, elapsed) => {
        //             mesh.position.copy(object)

        //             mesh.matrixWorldNeedsUpdate = true

        //             return Promise.resolve(state)
        //         },
        //     })
        //     tween = ArticluatedAnimation.to(tween, { x: x, y: y, z: z + BuildCabinetDrawer.getDepth() }, 1500)

        //     return tweens.concat([tween])
        // }, [])


        let [x, y, z] = drawer.position.toArray()

        let tween = ArticluatedAnimation.createTween(
            [
                readState,
                writeState
            ],
            { x, y, z }, {
            onUpdate: (state, object, elapsed) => {
                drawer.position.copy(object)

                drawer = Object3DUtils.markNeedsUpdate(drawer)

                return Promise.resolve(state)
            },
        })
        tween = ArticluatedAnimation.to(tween, { x: x, y: y, z: z + BuildCabinetDrawer.getDepth() }, 1500)

        let drawerGoOutArticluatedAnimationTweens = [tween]


        return ArticluatedAnimation.playArticluatedAnimation(state,
            [
                readState,
                writeState,
                getAbstractState,
                setAbstractState
            ],
            animationName, drawerGoOutArticluatedAnimationTweens, {
            onStart: (state: state) => {
                state = _setState(state, {
                    ..._getState(state),
                    // animatedDrawer: NullableUtils.return_(selectedMesh),
                    animatedDrawer: NullableUtils.return_(drawer),
                    // playingArticluatedAnimationName: animationName,
                })

                // state = meshes.reduce((state, mesh) => {
                //     state = setAbstractState(state, Instance.markNeedUpdateColor(getAbstractState(state), mesh.name, new Color(1, 0, 0)))

                //     return state
                // }, state)

                return Event.trigger<state>(state, getAbstractState, getCabinetDrawerAnimationIsPlayingEventName(), null)
            },
            onComplete: (state: state) => {
                // state = _setState(state, {
                //     ..._getState(state),
                //     playingArticluatedAnimationName: null,
                // })

                // let [cabinerNumber, drawerNumber] = getNumberFromDrawerName(selectedMesh.name)
                let [cabinerNumber, drawerNumber] = getNumberFromDrawerName(drawer.name)

                return Event.trigger<state>(state, getAbstractState, getShowModalEventName(), {
                    cabinerNumber,
                    drawerNumber,
                    screenCoordniate: NullableUtils.getExn(State.getPickState(getAbstractState(state)).screenCoordniate).toArray()
                })
            }
        })
    }

    return state
}

let _enterEventHandler = (state: state, { userData }) => {
    let targets = NullableUtils.getExn(userData).targets

    let pickedWholeCabinet
    if (targets.count() == 0) {
        pickedWholeCabinet = null
    }
    else {
        pickedWholeCabinet = _getWholeCabinet(NullableUtils.getExn(targets.get(0)), getState(state).dynamicGroup)
    }

    // let abstractState = Outline.setSelectedObjects(getAbstractState(state), NullableUtils.getWithDefault(
    //     NullableUtils.map(pickedWholeCabinet => [pickedWholeCabinet], pickedWholeCabinet),
    //     [],
    // ))

    // state = setAbstractState(state, abstractState)

    if (!NullableUtils.isNullable(pickedWholeCabinet)) {
        // let selectedMesh = NullableUtils.getExn(targets.get(0)).object
        let selectedCabinet = NullableUtils.getExn(pickedWholeCabinet)

        // if (_isFirstCabinet(selectedCabinet.name)) {
        if (isCabinet(selectedCabinet.name)) {
            // state = _judgeAndPlayDrawerGoOutArticluatedAnimation(state, selectedMesh)

            switch (getCurrentMode(state)) {
                // case mode.OpearteCabinet:
                //     return Promise.resolve(state)
                // break
                case mode.Default:
                    // default:
                    return enterMode(state, selectedCabinet)
                // return 
                // break
            }

        }
    }

    return Promise.resolve(state)
}

// let _closePageEventHandler = (state, { userData }) => {
//     // if (!NullableUtils.isNullable(document.querySelector("#ui_page"))) {
//     //     NullableUtils.getExn(document.querySelector<HTMLElement>("#ui_page")).style.display = "none"
//     // }
//     hide("ui_page")

//     state = _playDrawerGoInArticluatedAnimation(state)

//     return Promise.resolve(state)
// }

export let parseAndAddResources = (state: state) => {
    let abstractState = getAbstractState(state)

    // let cabinetDrawer = new InstanceSourceLOD.InstanceSourceLOD()

    // cabinetDrawer.receiveShadow = true
    // cabinetDrawer.castShadow = false

    return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, getDrawerResourceId()), Render.getRenderer(abstractState)).then((drawer: Object3D) => {
        // obj.material = NewThreeInstance.createMeshPhysicalMaterial({}).copy(obj.material as Material)

        // var material1 = new THREE.MeshStandardMaterial();

        // var material2 = NewThreeInstance.createMeshPhysicalMaterial(obj.material)

        // obj.material = material2

        // obj.material = AmbientLight.makeMaterialToAceeptAmbientLight(obj.material as MeshStandardMaterial)


        drawer.receiveShadow = true
        drawer.castShadow = false

        let drawerMesh = drawer.children[0] as Mesh

        let material = drawerMesh.material as MeshStandardMaterial

        material.color = BuildCabinetDrawer.getColor()
        // material.metalness = BuildCabinetDrawer.getMetalness()
        // material.roughness = BuildCabinetDrawer.getRoughness()

        drawer.scale.multiply(new Vector3(0.01, 0.0098, 0.0092))

        return _setState(state, {
            ..._getState(state),
            drawer: NullableUtils.return_(drawer)
        })
    })
}

export let initWhenImportScene = (state: state) => {
    let abstractState = getAbstractState(state)

    abstractState = Event.on(abstractState, Pick.getEnterEventName(), _enterEventHandler)

    state = setAbstractState(state, abstractState)

    return Promise.resolve(state)
}

let _getWholeCabinet = ({ instanceId, object }, dynamicGroup) => {
    let _func = (object) => {
        let target

        if (Instance.isInstancedMesh(object.name)) {
            let name = Instance.restoreName(object.name)
            name = Instance.addInstanceIdPostfix(name, instanceId)

            target = Scene.findObjectByName(dynamicGroup, name)
        }
        else {
            target = object
        }

        let parent = target.parent

        if (NullableUtils.isNullable(parent)) {
            return null
        }

        if (NullableUtils.getExn(parent).name == getDynamicGroupName()) {
            return target
        }

        return _func(NullableUtils.getExn(parent))
    }

    return _func(object)
}

// let _resetUI = (state: state) => {
//     hide("ui_page")

//     return state
// }

export let dispose = (state: state) => {
    // state = _getState(state).articluatedAnimationNames.reduce((state, articluatedAnimationNames) => {
    //     return articluatedAnimationNames.reduce((state, articluatedAnimationName) => {
    //         return remove(state, articluatedAnimationName)
    //     }, state)
    // }, state)
    // let abstractState = ArticluatedAnimation.removeArticluatedAnimation(getAbstractState(state), ["drawer_GoOut", "drawer_GoIn"])

    let abstractState = getAbstractState(state)

    // abstractState = Event.off(abstractState, Pick.getPickEventName(), _enterEventHandler)
    abstractState = Event.off(abstractState, Pick.getEnterEventName(), _enterEventHandler)
    // state = off(state, getClosePageEventName(), _closePageEventHandler)

    // state = _resetUI(state)

    state = _setState(state, {
        ..._getState(state),
        animatedDrawer: null,
        // playingArticluatedAnimationName: null
    })

    state = setAbstractState(state, abstractState)

    return Promise.resolve(state)
}

export let playDrawerGoInArticluatedAnimation = (state: state) => {
    let animatedDrawer = NullableUtils.getExn(_getState(state).animatedDrawer)
    let animationName = _buildGoInAnimationName(Instance.getInstanceId(animatedDrawer.name))

    if (!_isPlayArticluatedAnimation(state, animationName)) {
        // let meshes = [animatedDrawer]

        // let drawerGoInArticluatedAnimationTweens = meshes.reduce((tweens, mesh, i) => {
        //     let [x, y, z] = mesh.position.toArray()

        //     let tween = ArticluatedAnimation.createTween(
        //         [
        //             readState,
        //             writeState
        //         ],
        //         { x, y, z: z }, {
        //         onUpdate: (state, object, elapsed) => {
        //             mesh.position.copy(object)

        //             mesh.matrixWorldNeedsUpdate = true

        //             return Promise.resolve(state)
        //         },
        //     })
        //     tween = ArticluatedAnimation.to(tween, { x: x, y: y, z: z - BuildCabinetDrawer.getDepth() }, 1500)

        //     return tweens.concat([tween])
        // }, [])

        // return ArticluatedAnimation.playArticluatedAnimation(state,
        //     [
        //         readState,
        //         writeState,
        //         getAbstractState,
        //         setAbstractState
        //     ],
        //     animationName, drawerGoInArticluatedAnimationTweens, {
        //     onStart: (state: state) => {
        //         // state = _setState(state, {
        //         //     ..._getState(state),
        //         //     playingArticluatedAnimationName: animationName,
        //         // })

        //         return Promise.resolve(state)
        //     },
        //     onComplete: (state: state) => {
        //         state = meshes.reduce((state, mesh) => {
        //             state = setAbstractState(state, Instance.markNeedUpdateColor(getAbstractState(state), mesh.id, Instance.getDefaultInstanceColor()))

        //             return state
        //         }, state)

        //         state = _setState(state, {
        //             ..._getState(state),
        //             animatedDrawer: null,
        //             // playingArticluatedAnimationName: null
        //         })

        //         return Event.trigger<state>(state, getAbstractState, getCabinetDrawerAnimationIsStopEventName(), null)
        //     }
        // })

        let [x, y, z] = animatedDrawer.position.toArray()

        let tween = ArticluatedAnimation.createTween(
            [
                readState,
                writeState
            ],
            { x, y, z: z }, {
            onUpdate: (state, object, elapsed) => {
                animatedDrawer.position.copy(object)

                animatedDrawer = Object3DUtils.markNeedsUpdate(animatedDrawer)

                return Promise.resolve(state)
            },
        })
        tween = ArticluatedAnimation.to(tween, { x: x, y: y, z: z - BuildCabinetDrawer.getDepth() }, 1500)

        let drawerGoInArticluatedAnimationTweens = [tween]

        return ArticluatedAnimation.playArticluatedAnimation(state,
            [
                readState,
                writeState,
                getAbstractState,
                setAbstractState
            ],
            animationName, drawerGoInArticluatedAnimationTweens, {
            onStart: (state: state) => {
                // state = _setState(state, {
                //     ..._getState(state),
                //     playingArticluatedAnimationName: animationName,
                // })

                return Promise.resolve(state)
            },
            onComplete: (state: state) => {
                // state = meshes.reduce((state, mesh) => {
                //     state = setAbstractState(state, Instance.markNeedUpdateColor(getAbstractState(state), mesh.name, Instance.getDefaultInstanceColor()))

                //     return state
                // }, state)

                state = _setState(state, {
                    ..._getState(state),
                    animatedDrawer: null,
                    // playingArticluatedAnimationName: null
                })

                return Event.trigger<state>(state, getAbstractState, getCabinetDrawerAnimationIsStopEventName(), null)
            }
        })

    }

    return state
}

// export let stopArticluatedAnimationName = (state) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(
//             playingArticluatedAnimationName => {
//                 return setAbstractState(state, ArticluatedAnimation.removeArticluatedAnimation(getAbstractState(state), [playingArticluatedAnimationName]))
//             },
//             _getState(state).playingArticluatedAnimationName
//         ),
//         state
//     )
// }

// export let findAllInstancedMeshsOfCabinet = (cabinet, state: state) => {
//     return Scene.findObjects(cabinet, obj => {
//         return obj.isMesh
//     }).map(sourceMesh => {
//         return Instance.findInstance(sourceMesh.id, getAbstractState(state))
//     }).filter(instancedMesh => !isNullable(instancedMesh)).map(instancedMesh => getExn(instancedMesh))
// }

export let getDrawerResourceId = () => "drawer"

export let getDrawerResourcePath = () => `./${getName()}/cabinet/drawer.glb`

export let getDrawer = (state: state) => {
    return NullableUtils.getExn(_getState(state).drawer)
}