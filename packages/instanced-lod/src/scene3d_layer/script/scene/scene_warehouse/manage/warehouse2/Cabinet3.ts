import { getBodyOriginName, getOriginName } from "../../Cabinet";

let _getType = () => "type3"

export let buildCabinetBodyName = (cabinetNumber: number) => {
    return `${getBodyOriginName()}_${_getType()}_${cabinetNumber}`
}
