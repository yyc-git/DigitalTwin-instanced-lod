import { getExn, isNullable } from "./utils/NullableUtils"
import { getLoaderState, setLoaderState } from "./state/State"
import { resourceId, resourceType, state } from "./type/StateType"
import { reducePromise } from "./utils/ArrayUtils"
import { TextureLoader } from "three"

export let load = (state: state, resourceData: Array<{ id: resourceId, path: string, type: resourceType }>, setPercentFunc) => {
    let count = resourceData.length

    setPercentFunc(0)

    return reducePromise(resourceData, (state, { id, path, type }, index) => {
        return fetch(path)
            .then(response => {
                switch (type) {
                    case resourceType.ArrayBuffer:
                        return response.arrayBuffer()
                    case resourceType.Texture:
                        return new Promise((resolve, reject) => {
                            new TextureLoader().load(path, resolve, (_) => { }, reject)
                        })
                    default:
                        throw new Error("err")
                }
            }).then(resource => {
                setPercentFunc(Math.floor((index + 1) / count * 100))

                return setLoaderState(state, {
                    ...getLoaderState(state),
                    resourceData: getLoaderState(state).resourceData.set(id, resource)
                })
            })
    }, state)
}

export let getResource = <resource>(state: state, id: resourceId): resource => {
    return getExn(getLoaderState(state).resourceData.get(id))
}

export let removeResource = (state: state, id: resourceId) => {
    return setLoaderState(state, {
        ...getLoaderState(state),
        resourceData: getLoaderState(state).resourceData.remove(id)
    })
}

export let removeResources = (state: state, getResourceIdFunc, sceneNumber) => {
    return sceneNumber.reduce((state, sceneNumber) => {
        return removeResource(state, getResourceIdFunc(sceneNumber))
    }, state)
}

export let isResourceLoaded = (state: state, id: resourceId) => {
    return getLoaderState(state).resourceData.has(id)
}
