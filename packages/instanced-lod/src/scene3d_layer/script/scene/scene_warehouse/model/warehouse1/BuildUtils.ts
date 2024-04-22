import { Box3, Color, Vector3 } from "three"
import { findAllCabinets, getCabinetNumber } from "../../Cabinet"
import { Billboard } from "meta3d-jiehuo-abstract"

// export let getCabinetDrawerColor = () => new Color(171 / 255, 153 / 255, 91 / 255)

export let addLabelToCabinet = (cabinetsParent) => {
    findAllCabinets(cabinetsParent).forEach((cabinet) => {
        if (cabinet.isMesh) {
            throw new Error("shouldn't be Mesh")
        }

        let number = getCabinetNumber(cabinet.name)

        // let label = Billboard.createLabal(`${i + 1}号柜子`, new Vector3().set(0, (new Box3().setFromObject(cabinet).getSize(new Vector3()).y / 2) * 1.5, 0), {
        let label = Billboard.createLabal(`${number}`, new Vector3().set(0, (new Box3().setFromObject(cabinet).getSize(new Vector3()).y / 2) * 1.5, 0), {
            isSizeAttenuation: true,
            width: 800,
            size: 520,
            backgroundColor: "blue",
            textColor: "white"
        })

        cabinet.add(label)
    })

    return cabinetsParent
}