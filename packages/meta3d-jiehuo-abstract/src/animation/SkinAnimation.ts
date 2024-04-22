import { getSkinAnimationState, setSkinAnimationState } from "../state/State"
import { skinAnimation, skinAnimationName, skinTargetName, state } from "../type/StateType"
import { Map, List } from "immutable"
import type { Object3D, AnimationClip } from "three"
import { AnimationMixer, LoopRepeat, LoopOnce } from "three"
import { forEach, getExn, getWithDefault } from "../utils/NullableUtils"

export let createState = (): skinAnimation => {
    return {
        animationClips: Map(),
        animationNames: Map(),
        mixerMap: Map()
    }
}

export let addSkinAnimation = (state: state, targetName: skinTargetName, name, data: AnimationClip) => {
    let animationNames = getSkinAnimationState(state).animationNames

    return setSkinAnimationState(state, {
        ...getSkinAnimationState(state),
        animationClips: getSkinAnimationState(state).animationClips.set(name, data),
        animationNames: animationNames.set(targetName, animationNames.has(targetName) ? getExn(animationNames.get(targetName)).push(name) : List([name]))
    })
}

export let removeSkinAnimation = (state: state, name) => {
    return setSkinAnimationState(state, {
        ...getSkinAnimationState(state),
        animationClips: getSkinAnimationState(state).animationClips.remove(name)
    })
}

export let addSkinAnimationMixer = (state: state, target: Object3D, targetName: skinTargetName) => {
    return setSkinAnimationState(state, {
        ...getSkinAnimationState(state),
        mixerMap: getSkinAnimationState(state).mixerMap.set(targetName, new AnimationMixer(target))
    })
}

export let playSkinAnimation = (state: state, name: skinAnimationName, targetName: skinTargetName, loop = true) => {
    let mixer = getExn(getSkinAnimationState(state).mixerMap.get(targetName))

    let animationAction = mixer.clipAction(getExn(getSkinAnimationState(state).animationClips.get(name)))

    animationAction.setLoop(
        loop ? LoopRepeat : LoopOnce,
        Infinity,
    )
    animationAction.play().fadeIn(0.1)

    return state
}

export let stopSkinAnimation = (state: state, name: skinAnimationName, targetName: skinTargetName) => {
    let mixer = getExn(getSkinAnimationState(state).mixerMap.get(targetName))

    let animationAction = mixer.clipAction(getExn(getSkinAnimationState(state).animationClips.get(name)))

    animationAction.stop()

    return state
}

export let stopTargetAllSkinAnimations = (state: state, targetName: skinTargetName) => {
    let { animationNames } = getSkinAnimationState(state)

    return getWithDefault(
        animationNames.get(targetName),
        List()
    ).reduce((state, animationName) => {
        return stopSkinAnimation(state, animationName, targetName)
    }, state)
}

export let updateSkinAnimation = (state: state, targetName: skinTargetName, deltaTime: number) => {
    forEach(mixer => {
        mixer.update(deltaTime)
    }, getSkinAnimationState(state).mixerMap.get(targetName))

    return state
}

export let disposeSkinAnimation = (state: state, target: Object3D, targetName: skinTargetName) => {
    let { animationClips, animationNames, mixerMap } = getSkinAnimationState(state)

    let skinAnimationNames = getWithDefault(
        animationNames.get(targetName),
        List()
    )

    // state = skinAnimationNames.reduce((state, animationName) => {
    //     return stopSkinAnimation(state, animationName, targetName)
    // }, state)
    state = stopTargetAllSkinAnimations(state, targetName)

    let mixer = getExn(mixerMap.get(targetName))

    skinAnimationNames.forEach(animationName => {
        let clip = getExn(animationClips.get(animationName))

        mixer.uncacheClip(clip)
        mixer.uncacheAction(clip, target)
        mixer.uncacheRoot(target)
    })

    return state
}

export let dispose = (state: state) => {
    return setSkinAnimationState(state, createState())
}