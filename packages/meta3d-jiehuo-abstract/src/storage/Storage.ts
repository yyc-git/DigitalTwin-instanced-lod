import * as localforage from "localforage"

export let getItem = <T>(key: string) => {
    return localforage.getItem<T>(key)
}

export let setItem = (key: string, value: any) => {
    return localforage.setItem(key, value)
}

export let removeItem = (key: string) => {
    return localforage.removeItem(key)
}