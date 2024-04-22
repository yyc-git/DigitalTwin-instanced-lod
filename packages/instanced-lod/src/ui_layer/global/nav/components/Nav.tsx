import "./Nav.scss"

import React, { useState, useEffect } from 'react';
import { Button, Layout } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { scene } from '../../store/GlobalStoreType';
import { setCurrentScene } from '../../store/GlobalStore';
import { AppDispatch, AppState } from '../../../store/AppStore';
import { switchScene } from '../../../../business_layer/Scene3D';
import { readState, writeState } from '../../../../business_layer/State';
import * as  ParkScene3D from '../../../../business_layer/ParkScene3D';
import * as  WarehouseScene3D from '../../../../business_layer/WarehouseScene3D';
// import { mode as modeEnum } from '../../../../scene3d_layer/script/scene/scene_warehouse/type/StateType';
// import { mode as modeEnum } from '../../../../scene3d_layer/script/scene/scene_warehouse/type/StateType';
import { setIsLoading, setPercent } from "../../../scene/loading/store/LoadingStore";
import { setInfo } from "../../../scene/info/store/InfoStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { mode as modeEnum } from "../../../scene/store/SceneStoreType";
import { startLoop, stopLoop } from "../../../../business_layer/Loop";

let Nav: React.FC = () => {
    let mode = useSelector<AppState>((state) => state.scene.mode)
    let currentScene = useSelector<AppState>((state) => state.global.currentScene)
    let sceneNumber = useSelector<AppState>((state) => state.global.sceneNumber) as number

    let [isSwitchScene, setIsSwitchScene] = useState(false)

    let dispatch: AppDispatch = useDispatch()

    let _manageResource = (state, targetScene, sceneNumber) => {
        let promise

        dispatch(setIsLoading(true))
        dispatch(setPercent(0))

        switch (targetScene) {
            case scene.Park:
                // if (!isResourceLoaded(state, ParkScene3D.getResourceId(sceneNumber))) {
                //     promise = load(state, [
                //         {
                //             id: ParkScene3D.getResourceId(sceneNumber),
                //             path: `./${ParkScene3D.getResourceId(sceneNumber)}.glb`
                //         },
                //     ], percent => dispatch(setPercent(percent)))
                // }
                // else {
                //     promise = Promise.resolve(state)
                // }

                // promise = promise.then(state => {
                //     return removeResources(state, WarehouseScene3D.getResourceId, WarehouseScene3D.getAllSceneIndices())
                // })
                promise = ParkScene3D.loadResource(state, percent => dispatch(setPercent(percent)), sceneNumber)
                break
            case scene.Warehouse:
            default:
                // if (!isResourceLoaded(state, WarehouseScene3D.getResourceId(sceneNumber))) {
                //     promise = new Promise((resolve, reject) => {
                //         load(state, [
                //             {
                //                 id: WarehouseScene3D.getResourceId(sceneNumber),
                //                 path: `./${WarehouseScene3D.getResourceId(sceneNumber)}.glb`
                //             },
                //         ], percent => dispatch(setPercent(percent))).then(resolve)
                //     })
                // }
                // else {
                //     promise = Promise.resolve(state)
                // }

                // promise = promise.then(state => {
                //     return removeResources(state, WarehouseScene3D.getResourceId, WarehouseScene3D.getAllSceneIndices().filter(value => value != sceneNumber))
                // })


                promise = WarehouseScene3D.loadResource(state, percent => dispatch(setPercent(percent)), sceneNumber)
                break
        }

        return promise.then(state => {
            dispatch(setIsLoading(false))

            return state
        })
    }

    let _switchScene = (currentScene, targetScene, sceneNumber) => {
        let state = readState()

        setIsSwitchScene(_ => true)

        state = stopLoop(state)
        state = writeState(state)

        _manageResource(state, targetScene, sceneNumber).then(state => {
            dispatch(setInfo(NullableUtils.return_("正在初始化")))

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(state)
                }, 100)
            })
        })
            .then(state => {
                return switchScene(state, currentScene, targetScene, sceneNumber)
            })
            .then(state => {
                state = startLoop(state)
                let _ = writeState(state)
            })
            .then(() => {
                dispatch(setInfo(null))
                setIsSwitchScene(_ => false)

                dispatch(setCurrentScene({ currentScene: targetScene, sceneNumber }))


            })
    }

    let _renderWarehouse = (sceneNumber) => {
        return WarehouseScene3D.getAllSceneNumbers().filter(value => value != sceneNumber).map(value => {
            return (
                <Button key={value} className="tab" type="primary" onClick={_ => _switchScene(currentScene, scene.Warehouse, value)}>
                    {`仓库${value}`}
                </Button>
            )
        })
    }

    let _render = (mode, currentScene) => {
        switch (mode) {
            case modeEnum.Operate:
                return null
            case modeEnum.Default:
            default:
                switch (currentScene) {
                    case scene.Park:
                        return <> {WarehouseScene3D.getAllSceneNumbers().map(value => {
                            return (
                                <Button key={value} className="tab" type="primary" onClick={_ => _switchScene(currentScene, scene.Warehouse, value)}>
                                    {`仓库${value}`}
                                </Button>
                            )
                        })
                        }
                        </>
                    case scene.Warehouse:
                    default:
                        return <>
                            <Button key={1} className="tab" type="primary" onClick={_ => _switchScene(currentScene, scene.Park, 1)}>
                                {`园区${1}`}
                            </Button>
                            {
                                _renderWarehouse(sceneNumber)
                            }
                        </>
                }
        }
    }

    return <Layout id={"ui_nav"} >
        {isSwitchScene ? null : _render(mode, currentScene)}
    </Layout >
};

export default Nav;