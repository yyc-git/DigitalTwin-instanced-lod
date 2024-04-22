import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Color } from "three"

// export let getCabinetColor = () => new Color(191 / 255, 173 / 255, 111 / 255)
// export let getCabinetColor = () => new Color(191 / 255 * 1.5, 173 / 255 * 1.5, 111 / 255 * 1.5)
// export let getCabinetColor = () => new Color(245/255, 222/255, 179/255)
// export let getCabinetColor = () => new Color(225/255, 193/255, 110/255)
export let getCabinetColor = () => new Color(242/255, 215/255, 164/255)


export let getCabinetMetalness = () => 0.99

export let getCabinetRoughness = () => 0.4
// export let getCabinetRoughness = () => 0.0


export let createCabinetMaterial = () => {
    return NewThreeInstance.createMeshPhysicalMaterial({
        color: getCabinetColor(),
        metalness: getCabinetMetalness(),
        roughness: getCabinetRoughness()
    })
}