// export let scale = () => {
//     let designWidth = 1920
//     let designHeight = 1080
//     let scale =
//         document.documentElement.clientWidth / document.documentElement.clientHeight < designWidth / designHeight
//             ? document.documentElement.clientWidth / designWidth
//             : document.documentElement.clientHeight / designHeight
//     return scale
// }


// 计算 fontSize
export let setFontSize = () => {
    let designWidth = 1920
    let designHeight = 1080
    var fontSize =
        document.documentElement.clientWidth / document.documentElement.clientHeight
            < designWidth / designHeight
            ? (document.documentElement.clientWidth / designWidth) * 100
            : (document.documentElement.clientHeight / designHeight) * 100
    document.querySelector('html').style.fontSize = fontSize + 'px'
}

// 防抖 在一定时间内 只执行最后一次
export let debounce = (fn, delay) => {
    let timer
    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn()
        }, delay)
    }
}
