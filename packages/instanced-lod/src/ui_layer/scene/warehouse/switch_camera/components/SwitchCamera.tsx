import "./SwitchCamera.scss"

import React, { useState, useEffect } from 'react';
import { Select, Layout } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { getAllCameraTypes, getCameraType, useOrbitControls, useThirdPersonControls } from "../../../../../business_layer/WarehouseScene3D";
import { readState, writeState } from "../../../../../business_layer/State";
import { AppState } from "../../../../store/AppStore";
import { mode as modeEnum } from "../../../store/SceneStoreType";

let SwitchCamera: React.FC = () => {
    let mode = useSelector<AppState>((state) => state.scene.mode)

    let _handleChange = (value: string) => {
        switch (value) {
            case "第三人称相机":
                useThirdPersonControls(readState()).then(writeState)
                break
            case "轨道相机":
                useOrbitControls(readState()).then(writeState)
                break
        }
    }

    let _render = (mode) => {
        switch (mode) {
            case modeEnum.Operate:
                return null
            case modeEnum.Default:
            default:
                return (
                    <Select className="camera-type"
                        key={Math.random().toString()}
                        defaultValue={getCameraType(readState())}
                        onChange={_handleChange}
                        options={
                            getAllCameraTypes().map(cameraType => {
                                return { value: cameraType, label: cameraType }
                            })
                        }
                    />
                )
        }
    }

    return <Layout  >
        {_render(mode)}
    </Layout >
};

export default SwitchCamera;