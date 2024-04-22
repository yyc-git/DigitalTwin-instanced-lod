import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../../type/StateType";
import { getState, setState } from "../../WarehouseScene";
import { Vector3 } from "three";

export let setControlsConfig = (state: state) => {
    return setState(state, {
        ...getState(state),
        orbitControlsConfig: NullableUtils.return_({
            position: new Vector3(30, 50, 40),
            target: new Vector3(30, 0, 0)
        }),
        thirdPersonControlsConfig: NullableUtils.return_({
            position: new Vector3(30, 25, 40),
        })
    })
}