export let getWidth = () => {
    // return document.documentElement.clientWidth
    return window.innerWidth || document.documentElement.clientWidth
}

export let getHeight = () => {
    // return document.documentElement.clientHeight
    return window.innerHeight || document.documentElement.clientHeight
}