import "./OpereateCabinetMode.scss"

import React, { useState, useEffect } from 'react';
import { Button, Layout, List, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
// import { Bar } from '@ant-design/plots';
import { getAbstractState, readState, writeState } from '../../../../../business_layer/State';
import { getExitOperateCabinetModeEventName, getEnterOperateCabinetModeEventName } from '../../../../../scene3d_layer/utils/EventUtils';
import { exitOperateCabinetMode } from '../../../../../business_layer/WarehouseScene3D';
import { trigger } from "meta3d-jiehuo-abstract/src/Event";
import { AppState } from "../../../../store/AppStore";
import { mode as modeEnum } from "../../../store/SceneStoreType";

let OpereateCabinetMode: React.FC = () => {
  let mode = useSelector<AppState>((state) => state.scene.mode)
  let cabinetDrawerAnimationIsPlaying = useSelector<AppState>((state) => state.warehouse.cabinetDrawerAnimationIsPlaying)

  let _handleClose = (event) => {
    // setIsShow(_ => false);

    writeState(exitOperateCabinetMode(readState()))

    trigger(readState(), getAbstractState, getExitOperateCabinetModeEventName(), null).then(writeState)
  }

  let _render = (mode) => {
    if (!cabinetDrawerAnimationIsPlaying && mode === modeEnum.Operate) {
      return (
        <Button type="primary" onClick={_handleClose}>
          退出
        </Button>
      )
    }

    return null
  }

  return <Layout className="mode">
    {_render(mode)}
  </Layout >
};

export default OpereateCabinetMode;