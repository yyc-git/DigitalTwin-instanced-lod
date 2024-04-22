import { getArticluatedAnimationState, setArticluatedAnimationState } from "../state/State";
// import TWEEN from 'three/examples/jsm/libs/tween.module.min';
import TWEEN from "../three/tween.module"
import { state, articluatedAnimation, tweenId, tween, articluatedAnimationStatus } from "../type/StateType";
import { reducePromise } from "../utils/ArrayUtils";
import { getExn, getWithDefault, map } from "../utils/NullableUtils";
import { Map } from "immutable"

let _writePromiseState = (writeStateFunc, statePromise) => {
    return statePromise.then(writeStateFunc)
}

export let createState = (): articluatedAnimation => {
    return {
        articluatedAnimationTweens: Map(),
        articluatedAnimationStatus: Map()
    }
}

export let createTween = (
    [
        readStateFunc,
        writeStateFunc,
    ],
    object, {
        onStart = (state: state, object) => Promise.resolve(state),
        onUpdate = (state, object, elapsed) => Promise.resolve(state),
        onRepeat = (state, object) => Promise.resolve(state),
        onComplete = (state, object) => Promise.resolve(state),
        onStop = (state, object) => Promise.resolve(state),
    }) => {
    return new TWEEN.Tween(object).onStart((object) => {
        return _writePromiseState(writeStateFunc, onStart(readStateFunc(), object))
    }).onUpdate((object, elapsed) => {
        return _writePromiseState(writeStateFunc, onUpdate(readStateFunc(), object, elapsed))
    }).onRepeat((object) => {
        return _writePromiseState(writeStateFunc, onRepeat(readStateFunc(), object))
    }).onComplete((object) => {
        return _writePromiseState(writeStateFunc, onComplete(readStateFunc(), object))
    }).onStop((object) => {
        return _writePromiseState(writeStateFunc, onStop(readStateFunc(), object))
    })
}

export let to = (tween, target, duration) => {
    return tween.to(target, duration)
}

let _setArticluatedAnimationStatus = (state, articluatedAnimationName: string, status: articluatedAnimationStatus) => {
    return setArticluatedAnimationState(state, {
        ...getArticluatedAnimationState(state),
        articluatedAnimationStatus: getArticluatedAnimationState(state).articluatedAnimationStatus.set(articluatedAnimationName, status)
    })
}

// export let addArticluatedAnimation = <specificState>([
//     readStateFunc,
//     writeStateFunc,
//     getAbstractStateFunc,
//     setAbstractStateFunc
// ], state: specificState, articluatedAnimationName: string, tweens, { onStart = (state) => Promise.resolve(state),
//     onComplete = (state) => Promise.resolve(state) }): specificState => {
//     // tweens[0].onStart = (object) => {
//     //     tweens[0].onStart(object).then(() => {
//     //         _writePromiseState(writeStateFunc, onStart(readStateFunc()).then(state => {
//     //             return _setArticluatedAnimationStatus(state, articluatedAnimationName, articluatedAnimationStatus.Playing)
//     //         }))
//     //     })
//     // }
//     // tweens[0].onComplete = (object) => {
//     //     tweens[0].onComplete(object).then(() => {
//     //         _writePromiseState(writeStateFunc, onComplete(readStateFunc()).then(state => {
//     //             return _setArticluatedAnimationStatus(state, articluatedAnimationName, articluatedAnimationStatus.NotPlaying)
//     //         }))
//     //     })
//     // }

//     let _onStartCallback = tweens[0]._onStartCallback
//     tweens[0].onStart((object) => {
//         _onStartCallback(object).then(() => {
//             _writePromiseState(writeStateFunc, onStart(readStateFunc()).then((state: specificState) => {
//                 return setAbstractStateFunc(state, _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.Playing))
//             }))
//         })
//     })

//     let _onCompleteCallback = tweens[0]._onCompleteCallback
//     tweens[0].onComplete((object) => {
//         _onCompleteCallback(object).then(() => {
//             _writePromiseState(writeStateFunc, onComplete(readStateFunc()).then((state: specificState) => {
//                 return setAbstractStateFunc(state, _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.NotPlaying))
//             }))
//         })
//     })


//     let abstractState = _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.NotPlaying)

//     return setAbstractStateFunc(state, setArticluatedAnimationState(abstractState, {
//         ...getArticluatedAnimationState(abstractState),
//         articluatedAnimationTweens: getArticluatedAnimationState(abstractState).articluatedAnimationTweens.set(articluatedAnimationName, tweens)
//     }))
// }

export let removeArticluatedAnimation = (state: state, articluatedAnimationNames: Array<string>): state => {
    return articluatedAnimationNames.reduce((state, articluatedAnimationName) => {
        getExn(getArticluatedAnimationState(state).articluatedAnimationTweens.get(articluatedAnimationName)).forEach(articluatedAnimationTween => {
            TWEEN.remove(articluatedAnimationTween)
        })

        return setArticluatedAnimationState(state, {
            ...getArticluatedAnimationState(state),
            articluatedAnimationStatus: getArticluatedAnimationState(state).articluatedAnimationStatus.remove(articluatedAnimationName),
            articluatedAnimationTweens: getArticluatedAnimationState(state).articluatedAnimationTweens.remove(articluatedAnimationName)
        })
    }, state)
}

export let removeAllArticluatedAnimations = (state: state): state => {
    return removeArticluatedAnimation(state, Array.from(getArticluatedAnimationState(state).articluatedAnimationTweens.keys()))
}

export let playArticluatedAnimation = <specificState>(state: specificState,
    [
        readStateFunc,
        writeStateFunc,
        getAbstractStateFunc,
        setAbstractStateFunc
    ],
    articluatedAnimationName: string,
    tweens,
    { onStart = (state) => Promise.resolve(state),
        onComplete = (state) => Promise.resolve(state) },
    time = undefined): specificState => {
    let _onStartCallback = tweens[0]._onStartCallback
    tweens[0].onStart((object) => {
        return _onStartCallback(object).then(() => {
            return _writePromiseState(writeStateFunc, onStart(readStateFunc()).then((state: specificState) => {
                return setAbstractStateFunc(state, _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.Playing))
            }))
        })
    })

    let _onCompleteCallback = tweens[0]._onCompleteCallback
    tweens[0].onComplete((object) => {
        return _onCompleteCallback(object).then(() => {
            return _writePromiseState(writeStateFunc, onComplete(readStateFunc()).then((state: specificState) => {
                let abstractState = _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.NotPlaying)

                abstractState = removeArticluatedAnimation(abstractState, [articluatedAnimationName])

                return setAbstractStateFunc(state, abstractState)
            }))
        })
    })

    let abstractState = _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.NotPlaying)


    tweens.forEach(articluatedAnimationTween => {
        articluatedAnimationTween.start(time)
    })

    return setAbstractStateFunc(state, setArticluatedAnimationState(abstractState, {
        ...getArticluatedAnimationState(abstractState),
        articluatedAnimationTweens: getArticluatedAnimationState(abstractState).articluatedAnimationTweens.set(articluatedAnimationName, tweens)
    }))
}

let _updateArticluatedAnimation = <specificState>(state: specificState, [readStateFunc, writeStateFunc, getAbstractStateFunc], articluatedAnimationNames: Array<string>, time = undefined): Promise<specificState> => {
    return reducePromise(articluatedAnimationNames, (state, articluatedAnimationName) => {
        return reducePromise(getExn(getArticluatedAnimationState(getAbstractStateFunc(state)).articluatedAnimationTweens.get(articluatedAnimationName)), (state, articluatedAnimationTween) => {
            writeStateFunc(state)

            if (articluatedAnimationTween.isPlaying()) {
                return articluatedAnimationTween.update(time, false).then(_ => {
                    return readStateFunc()
                })
            }

            return Promise.resolve(readStateFunc())
        }, state)
    }, state)
}

export let updateAllArticluatedAnimations = <specificState>(state: specificState, [readStateFunc, writeStateFunc, getAbstractStateFunc], time = undefined): Promise<specificState> => {
    return _updateArticluatedAnimation(state, [readStateFunc, writeStateFunc, getAbstractStateFunc], Array.from(getArticluatedAnimationState(getAbstractStateFunc(state)).articluatedAnimationTweens.keys()), time)
}

export let isArticluatedAnimationPlaying = (state: state, articluatedAnimationName: string) => {
    return getWithDefault(
        map(
            tweens => {
                return tweens.reduce((isPlaying, articluatedAnimationTween) => {
                    if (isPlaying) {
                        return true
                    }

                    return articluatedAnimationTween.isPlaying()
                }, false)
            },
            getArticluatedAnimationState(state).articluatedAnimationTweens.get(articluatedAnimationName),
        ),
        false
    )
}

export let getArticluatedAnimationStatus = (state, articluatedAnimationName: string) => {
    return getExn(getArticluatedAnimationState(state).articluatedAnimationStatus.get(articluatedAnimationName))
}

export let dispose = (state: state) => {
    return setArticluatedAnimationState(state, createState())
}