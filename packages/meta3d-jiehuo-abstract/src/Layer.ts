import type { Layers, Object3D } from "three"
import { layer } from "./type/StateType"

// export let enableVisibleLayer = (layers: Layers) => {
//     layers.enable(layer.Visible)
// }

export let enablePickableLayer = (layers: Layers) => {
    layers.enable(layer.Pickable)
}

// export let setNotVisibleLayer = (layers: Layers) => {
//     layers.set(layer.NotVible)
// }

// export let setVisibleLayer = (layers: Layers) => {
//     layers.set(layer.Visible)
// }

export let setPickableLayer = (layers: Layers) => {
    layers.set(layer.Pickable)
}

export let disablePickableLayer = (layers: Layers) => {
    layers.disable(layer.Pickable)
}


// export let setAllToVisibleLayer = (object: Object3D) => {
//     object.traverse(obj => {
//         setVisibleLayer(obj.layers)
//     })
// }

// export let setAllToNotVisibleLayer = (object: Object3D) => {
//     object.traverse(obj => {
//         setNotVisibleLayer(obj.layers)
//     })
// }

// export let enableAllToVisibleLayer = (object: Object3D) => {
//     object.traverse(obj => {
//         enableVisibleLayer(obj.layers)
//     })
// }

// export let disableAllVisibleLayer = (object: Object3D) => {
//     object.traverse(obj => {
//         obj.layers.disable(layer.Visible)
//     })
// }

export let setAllToPickableLayer = (object: Object3D) => {
    object.traverse(obj => {
        setPickableLayer(obj.layers)
    })
}

export let enableAllPickableLayer = (object: Object3D) => {
    object.traverse(obj => {
        obj.layers.enable(layer.Pickable)
    })
}

export let disableAllPickableLayer = (object: Object3D) => {
    object.traverse(obj => {
        obj.layers.disable(layer.Pickable)
    })
}