// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { OutlinePass } from './three/OutlinePass'
import { getPickState, getRenderState, setPickState } from "./state/State";
import { pick, state } from "./type/StateType";
import { isInstanceSourceObject } from './instance/Instance';
import { markAllMeshesNotVisible, markAllMeshesVisible } from './utils/Object3DUtils';
// import { getCurrentScene } from './scene/Scene';
// import { isEqualByName } from './utils/Object3DUtils';

export let setSelectedObjects = (state: state, selectedObjects) => {
    let { outlinePass } = getRenderState(state)

    outlinePass.selectedObjects = selectedObjects;

    return state
}

export let init = (state: state) => {
    // state = on(state, getPickEventName(), (specficState, { userData }) => {
    //     let state = getAbstractStateFunc(specficState)

    //     state = _setSelectedObjects(state, getExn(userData).topTarget)

    //     return Promise.resolve(setAbstractStateFunc(specficState, state))
    // })

    let outlinePass = getRenderState(state).outlinePass as any

    outlinePass.preRenderHandlers.push(
        pass => {
            if (pass instanceof OutlinePass) {
                pass.selectedObjects.forEach(object => {
                    if (isInstanceSourceObject(object.id, state)) {
                        markAllMeshesVisible(object)
                    }
                })
            }
        }
    )
    outlinePass.postRenderHandlers.push(
        pass => {
            if (pass instanceof OutlinePass) {
                pass.selectedObjects.forEach(object => {
                    if (isInstanceSourceObject(object.id, state)) {
                        markAllMeshesNotVisible(object)
                    }
                })
            }
        }
    )

    return Promise.resolve(state)
}