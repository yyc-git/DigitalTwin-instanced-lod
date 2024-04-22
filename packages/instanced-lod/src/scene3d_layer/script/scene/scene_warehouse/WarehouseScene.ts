import { Vector3, Box3, DirectionalLight, PerspectiveCamera, Group, Object3D, DirectionalLightHelper, PointLight, SphereGeometry, MeshBasicMaterial, Mesh, PCFShadowMap, BasicShadowMap, MeshPhysicalMaterial, Color, Sprite } from "three"
// import { createLabal } from "meta3d-jiehuo-abstract"
// import { range } from "meta3d-jiehuo-abstract"
// import { getWarehouseSceneState, getRenderState, getSceneState, setAllScenesState, setSceneState } from "../../../state/State"
import { cameraType, state } from "../../../type/StateType"
// import { createState as createCabinetState, findAllCabinets, findOriginCabinet, init as initCabinet, update as updateCabinet, dispose as disposeCabinet, playDrawerGoInArticluatedAnimation, findAllDrawers, getCabinetNumber } from "./Cabinet"
import { createState as createCabinetState, getDrawerResourceId, getDrawerResourcePath } from "./manage/warehouse1/Cabinet1"
// import { addInstanceIdPostfixToObject, convertLODToInstanceMeshLOD, updateAllInstanceMatrices } from "meta3d-jiehuo-abstract"
// import { parseGlb } from "meta3d-jiehuo-abstract"
// import { getResource } from "meta3d-jiehuo-abstract"
// import { addAmbientLight, buildResourceId } from "meta3d-jiehuo-abstract"
// import { Scene.findObjects, getScene as getWholeScene, setCurrentScene } from "../Scene"
import * as WarehouseSceneCamera from "./Camera"
// import { getOrbitControls, setCurrentCamera, setOrbitControls } from "meta3d-jiehuo-abstract"
// import { getHeight, getWidth } from "meta3d-jiehuo-abstract"
import { mode, warehouseScene } from "./type/StateType"
import { getAbstractState, getWarehouseSceneState, setAbstractState, setWarehouseSceneState } from "../../../state/State"
// import { Scene.findObjects, getScene as getWholeScene, setCurrentScene } from "meta3d-jiehuo-abstract"
// import { getRenderState } from "meta3d-jiehuo-abstract"
import { getAllScenes, getIsDebug } from "../Scene"
import { Device, Layer, NullableUtils } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
import { Billboard, Camera, Instance, Loader, Scene, ModelLoader, State, View, Octree } from "meta3d-jiehuo-abstract"
import * as Girl from "./Girl"
// import * as BuildCabinetBody from "./model/warehouse1/BuildCabinetBody"
import * as BuildScene1 from "./model/warehouse1/BuildScene"
import * as BuildScene2 from "./model/warehouse2/BuildScene"
import * as OperateCabinetMode from "./mode_operate_cabinet/OperateCabinetMode"
import { resourceType } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as ManageScene1 from "./manage/warehouse1/ManageScene"
import * as ManageScene2 from "./manage/warehouse2/ManageScene"
import { findAllBodys } from "./Cabinet"
import { Render } from "meta3d-jiehuo-abstract"
import { Environment } from "meta3d-jiehuo-abstract"
import { Storage } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { getShowTipEventName } from "../../../utils/EventUtils"

export let getState = (state: state) => {
    return NullableUtils.getExn(getWarehouseSceneState(state))
}

export let setState = (state: state, warehouseSceneState: warehouseScene) => {
    return setWarehouseSceneState(state, warehouseSceneState)
}

export let getName = () => "warehouse"

export let isWall = (name: string) => {
    return name.toLocaleLowerCase().includes("wall")
}

// let getStaticGroupName = (name: string) => {
//     return name == "static_group"
// }

// let _isDynamicGroup = (name: string) => {
//     return name == "dynamic_group"
// }
export let getStaticGroupName = () => "static_group"

export let getDynamicGroupName = () => "dynamic_group"

export let getAllSceneIndices = () => [1, 2]

export let findLabel = (cabinet: Object3D) => {
    return cabinet.children.filter(child => {
        return (child as Sprite).isSprite
    })[0] as Sprite
}

export let getNullableScene = (state: state) => {
    return getState(state).scene
}

export let getScene = (state: state) => {
    return NullableUtils.getExn(getNullableScene(state))
}

export let getAllSceneNumbers = () => [1, 2]

export let getOctree = (state: state) => {
    return getState(state).octree
}

// let _setOctree = (state: state, octree) => {
//     return setState(state, {
//         ...getState(state),
//         octree: octree
//     })
// }

export let importScene = (state: state, renderer, sceneNumber: number) => {
    let promise

    switch (sceneNumber) {
        case 1:
            // promise = ManageScene1.parseAndAddResources(state)
            //     .then(state => {
            //         state = BuildScene1.build(state, renderer)

            //         return ManageScene1.initWhenImportScene(state)
            //     })
            state = BuildScene1.build(state, renderer)

            promise = ManageScene1.initWhenImportScene(state)

            break
        case 2:
            // promise = ManageScene2.parseAndAddResources(state).then(state => {
            //     state = BuildScene2.build(state, renderer)

            //     return ManageScene2.initWhenImportScene(state)
            // })
            state = BuildScene2.build(state, renderer)

            promise = ManageScene2.initWhenImportScene(state)
            break
        default:
            throw new Error(`not support sceneNumber: ${sceneNumber}`)
    }

    return promise.then(state => {
        let octree = Octree.reset(getOctree(state), 2)

        let scene = getScene(state)
        Scene.updateMatrixWorld(scene)

        let data = Octree.build(scene, octree, findAllBodys(scene).concat([getState(state).staticGroup]), getIsDebug(state))
        // let data = Octree.build(scene, octree, [getState(state).staticGroup], getIsDebug(state))
        scene = data[0]
        octree = data[1]

        state = setState(state, {
            ...getState(state),
            octree: octree,
            scene: scene
        })

        return setState(state, {
            ...getState(state),
            sceneNumber: sceneNumber
        })
    })
}

export let getDefaultCameraType = () => cameraType.ThirdPerson
// export let getDefaultCameraType = () => cameraType.Orbit

export let createState = (): warehouseScene => {
    return {
        isFirstEnter: true,
        scene: null,
        sceneNumber: 1,
        staticGroup: null,
        dynamicGroup: null,
        // perspectiveCamera: WarehouseSceneCamera.createPerspectiveCamera(),
        // orthographicCamera: TrackableCameraControls.createOrthoCamera(),
        cameraType: getDefaultCameraType(),
        orbitControlsConfig: null,
        thirdPersonControlsConfig: null,
        cabinet1: createCabinetState(),
        octree: Octree.create(2),
        octreeHelper: null,
        girl: Girl.createState(),
        operateCabinetMode: OperateCabinetMode.createState(),
        currentMode: mode.Default,
        roomEnvironment: null
    }
}

// export let getPerspectiveCamera = (state: state) => {
//     return NullableUtils.getExn(getState(state).perspectiveCamera)
// }

// export let getOrthoCamera = (state: state) => {
//     return NullableUtils.getExn(getState(state).orthographicCamera)
// }

export let setToCurrentCamera = (state: state, camera, controls) => {
    let abstractState = Camera.setCurrentCamera(getAbstractState(state), camera)
    abstractState = Camera.setCurrentControls(abstractState, controls)

    return setAbstractState(state, abstractState)
}

let _getSceneNumber = (state: state) => {
    return getState(state).sceneNumber
}

export let init = (state: state) => {
    state = setState(state, {
        ...getState(state),
        roomEnvironment: NullableUtils.return_(Environment.generateRoomEnvironment(getAbstractState(state), 0.5))
    })

    switch (_getSceneNumber(state)) {
        case 1:
            return ManageScene1.init(state)
        case 2:
            return ManageScene2.init(state)
        default:
            throw new Error("error")
    }
}

export let update = (state: state) => {
    switch (_getSceneNumber(state)) {
        case 1:
            return ManageScene1.update(state)
        case 2:
            return ManageScene2.update(state)
            break
        default:
            throw new Error("error")
    }
}

export let dispose = (state: state) => {
    state = WarehouseSceneCamera.dispose(state)

    switch (_getSceneNumber(state)) {
        case 1:
            return ManageScene1.dispose(state)
        case 2:
            return ManageScene2.dispose(state)
            break
        default:
            throw new Error("error")
    }
}

let _useCurrentCameraWhenEnterScene = (state: state): Promise<state> => {
    switch (getState(state).cameraType) {
        case cameraType.ThirdPerson:
            // /*! fix ios crash bug
            // description
            // will crash when switch scene number

            // reason
            // girl is skinned mesh, show girl(visible = true) will prepare skin(related code: WebGLRenderer.js->setProgram->if ( object.isSkinnedMesh ) ) which takes much time and make crash

            // solution
            // defer compute skin to give enough time for enter scene*/
            return _deferUseThirdPersonControls(state)
        case cameraType.Orbit:
        default:
            return useOrbitControls(state)
    }
}

let _setRoomEnvironment = (scene, state: state) => {
    return Environment.setRoomEnvironment(scene,
        NullableUtils.getExn(getState(state).roomEnvironment), new Color(0xbbbbbb))
}

export let enterScene = (state: state, sceneNumber: number) => {
    let promise
    if (getState(state).isFirstEnter) {
        state = setState(state, {
            ...getState(state),
            isFirstEnter: false
        })

        promise = init(state)
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(state => {
        return importScene(state, State.getRenderState(getAbstractState(state)).renderer, sceneNumber)
    })
        .then(state => {
            let scene = getScene(state)

            scene = _setRoomEnvironment(scene, state)

            state = setAbstractState(state, Scene.setCurrentScene(getAbstractState(state), getAllScenes(state), scene))

            return _useCurrentCameraWhenEnterScene(state)
        })
}

export let playCabinetDrawerGoInArticluatedAnimation = ManageScene1.playCabinetDrawerGoInArticluatedAnimation

export let getWoordTextureResourceId = () => "wood"

let _getWoordTextureResourcePath = () => `./${getName()}/texture/wood.jpg`

export let getTileTextureResourceId = () => "tile"

let _getTileTextureResourcePath = () => `./${getName()}/texture/tile.jpg`

export let loadResource = (state: state, setPercentFunc, sceneNumber: number) => {
    let promise
    // if (!Loader.isResourceLoaded(getAbstractState(state), SceneUtils.buildResourceId(getName, sceneNumber))) {
    if (!Loader.isResourceLoaded(getAbstractState(state),
        Girl.getResourceId(),
    )) {
        promise = Loader.load(getAbstractState(state), [
            // {
            //     id: SceneUtils.buildResourceId(getName, sceneNumber),
            //     path: `./${getName()}/${SceneUtils.buildResourceId(getName, sceneNumber)}.glb`
            // },
            {
                id: getDrawerResourceId(),
                path: getDrawerResourcePath(),
                type: resourceType.ArrayBuffer
            },
            {
                id: getTileTextureResourceId(),
                path: _getTileTextureResourcePath(),
                type: resourceType.Texture
            },
            {
                id: getWoordTextureResourceId(),
                path: _getWoordTextureResourcePath(),
                type: resourceType.Texture
            },
            {
                id: Girl.getResourceId(),
                path: Girl.getResourcePath(getName()),
                type: resourceType.ArrayBuffer
            },
            {
                id: Girl.getIdleAnimationResourceId(),
                path: Girl.getIdleAnimationResourcePath(getName()),
                type: resourceType.ArrayBuffer
            },
            {
                id: Girl.getRunningAnimationResourceId(),
                path: Girl.getRunningAnimationResourcePath(getName()),
                type: resourceType.ArrayBuffer
            },
        ], setPercentFunc).then(abstractState => {
            return setAbstractState(state, abstractState)
        })
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise
}

export let useOrbitControls = (state: state) => {
    state = Girl.hideGirl(state)

    state = WarehouseSceneCamera.disposeThirdPersonControls(state)

    state = setToCurrentCamera(state, WarehouseSceneCamera.createPerspectiveCamera(), Camera.getOrbitControls(getAbstractState(state)))

    state = WarehouseSceneCamera.useOrbitControls(state)

    return Promise.resolve(state)
}

let _useThirdPersonControls = (state: state, showGirlFunc) => {
    state = setToCurrentCamera(state, WarehouseSceneCamera.createPerspectiveCamera(), Camera.getOrbitControls(getAbstractState(state)))

    state = WarehouseSceneCamera.useThirdPersonControls(state)

    state = showGirlFunc(state)

    return Promise.resolve(state)
}

export let useThirdPersonControls = (state: state) => {
    return _useThirdPersonControls(state, Girl.immediatelyShowGirl)
}

let _deferUseThirdPersonControls = (state: state) => {
    return _useThirdPersonControls(state, (state) => Girl.deferShowGirl(state, 3))
}

export let getCurrentMode = (state: state) => {
    return getState(state).currentMode
}

export let setCurrentMode = (state: state, mode: mode) => {
    return setState(state, {
        ...getState(state),
        currentMode: mode
    })
}

export let exitOperateCabinetMode = OperateCabinetMode.exitMode

export let getCameraType = (state: state) => {
    return getState(state).cameraType
}

// export let cull = (state: state) => {
//     switch (_getSceneNumber(state)) {
//         case 1:
//             return ManageScene1.cull(state)
//         case 2:
//             return ManageScene2.cull(state)
//         default:
//             throw new Error("error")
//     }
// }
