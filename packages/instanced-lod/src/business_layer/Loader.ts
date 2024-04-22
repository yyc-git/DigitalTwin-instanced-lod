import { state } from "../scene3d_layer/type/StateType";
import { scene } from "../ui_layer/global/store/GlobalStoreType";
import * as ParkScene3D from "../business_layer/ParkScene3D";
import * as WarehouseScene3D from "../business_layer/WarehouseScene3D";

export let loadCurrentSceneResource = (state: state, setPercentFunc, currentScene, sceneNumber) => {
    switch (currentScene) {
        case scene.Park:
            return ParkScene3D.loadResource(state, setPercentFunc, sceneNumber)
        case scene.Warehouse:
        default:
            return WarehouseScene3D.loadResource(state, setPercentFunc, sceneNumber)
    }
}