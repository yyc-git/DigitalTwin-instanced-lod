import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { setState, getState, getDynamicGroupName, getName, getStaticGroupName } from "../../ParkScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getGirlState } from "../../Girl"
import { Color, Vector3 } from "three"
import { setControlsConfig } from "./Camera"
import { Scene } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { SceneUtils } from "meta3d-jiehuo-abstract"
import { addDirectionLight } from "../../Light"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import * as Tree1 from "../../manage/park1/Tree1"
import * as Animated from "../../manage/park1/Animated"
import { Instance } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"

let _addGroups = (scene, [staticGroup, dynamicGroup]) => {
    scene.add(staticGroup, dynamicGroup)

    return scene
}

let _addTrees = (state: state, scene) => {
    let dynamicGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getDynamicGroupName()))

    let tree1 = NullableUtils.getExn(getState(state).tree.tree1)



    let count
    if(Device.isMobile()){
        count = 3000
    }
    else{
        count = 6000
    }

    // dynamicGroup = ArrayUtils.range(1, 3000).reduce((dynamicGroup, number) => {
    dynamicGroup = ArrayUtils.range(1, count).reduce((dynamicGroup, number) => {
        // Layer.enableAllPickableLayer(cabinet)

        number = number % 300

        let clonedOne = tree1.clone(true)
        clonedOne.name = Tree1.buildName()

        clonedOne.position.set((Math.random() * 2 - 1) * 12 * number, 0, (Math.random() * 2 - 1) * 12 * number)

        dynamicGroup.add(clonedOne)

        return dynamicGroup
    }, dynamicGroup)

    // dynamicGroup = addLabelToCabinet(dynamicGroup)

    return scene
}

let _addAnimateds = (state: state, scene) => {
    let dynamicGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getDynamicGroupName()))

    let box = NullableUtils.getExn(getState(state).animated.box)

    let count
    if(Device.isMobile()){
        count = 2000
    }
    else{
        count = 4000
    }

    dynamicGroup = ArrayUtils.range(1, count).reduce((dynamicGroup, number) => {
        // Layer.enableAllPickableLayer(cabinet)

        number = number % 300

        let clonedOne = box.clone(true)
        clonedOne.name = Animated.buildName()

        let initialPosition = new Vector3(
            (Math.random() * 2 - 1) * 12 * number, 5, (Math.random() * 2 - 1) * 12 * number
        )

        // clonedOne.position.set((Math.random() * 2 - 1) * 12 * number, 10, (Math.random() * 2 - 1) * 12 * number)
        clonedOne.position.copy(initialPosition)

        // setInterval(() => {
        //     if (clonedOne.position.x > 500) {
        //         clonedOne.position.copy(initialPosition)
        //     }
        //     else {
        //         clonedOne.position.setX(clonedOne.position.x + 2)
        //     }


        //     let _ = Object3DUtils.markNeedsUpdate(clonedOne)
        // }, Math.random() * 100 + 16)

        dynamicGroup.add(clonedOne)

        return dynamicGroup
    }, dynamicGroup)

    return scene
}

let _addGround = (scene, state: state) => {
    let ground = NewThreeInstance.createMesh(
        NewThreeInstance.createPlaneGeometry(1000, 1000, 1, 1),
        NewThreeInstance.createMeshPhysicalMaterial({
            color: new Color(0xffffff),
            metalness: 0.1,
            roughness: 0.9
        })
    )


    ground.rotateX(-Math.PI / 2)
    // ground = Object3DUtils.markNeedsUpdate(ground)
    // ground.position.setY(-1000 / 2)

    // ground.receiveShadow = true

    let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

    staticGroup.add(ground)

    return scene
}

let _addInstances = (state: state, scene, dynamicGroup) => {
    let data = Instance.convertLODToInstanceMeshLOD(getAbstractState(state), scene, Tree1.findAllTree1s(dynamicGroup))
    state = setAbstractState(state, data[0])
    scene = data[1]

    data = Instance.convertNotLODToInstanceMesh(getAbstractState(state), scene, Animated.findAllAnimateds(dynamicGroup))
    state = setAbstractState(state, data[0])
    scene = data[1]

    return [state, scene]
}

let _addLight = (state: state, scene, renderer) => {
    scene = SceneUtils.addAmbientLight(scene)

    let data = addDirectionLight(state, scene, renderer)
    state = data[0]
    scene = data[1]

    return [state, scene]
}

export let build = (state: state, renderer) => {
    let staticGroup = Scene.createGroup(getStaticGroupName())
    let dynamicGroup = Scene.createGroup(getDynamicGroupName())

    let scene = Scene.createScene(getName())

    state = setState(state, {
        ...getState(state),
        staticGroup: NullableUtils.return_(staticGroup),
        dynamicGroup: NullableUtils.return_(dynamicGroup),
        scene: NullableUtils.return_(scene),
        girl: {
            ...getGirlState(state),
            position: new Vector3(0, 0, 5)
        }
    })

    state = setControlsConfig(state)

    let data

    scene = _addGroups(scene, [staticGroup, dynamicGroup])

    scene = _addTrees(state, scene)

    scene = _addAnimateds(state, scene)

    scene = _addGround(scene, state)

    data = _addLight(state, scene, renderer)
    state = data[0]
    scene = data[1]


    data = _addInstances(state, scene, dynamicGroup)
    state = data[0]
    scene = data[1]


    Scene.getScene(getAbstractState(state)).add(scene)

    return state
}