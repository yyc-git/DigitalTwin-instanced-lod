import React, { useState, useEffect } from 'react';
import { Layout, List, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import Modal from '../modal/components/Modal';
import Header from '../../header/components/Header';
import SwitchCamera from '../switch_camera/components/SwitchCamera';
import OpereateCabinetMode from '../operate_cabinet_mode/components/OpereateCabinetMode';
import { AppDispatch, AppState } from '../../../store/AppStore';
// import Box1 from "../box1/components/Box1";
import { setCabinetDrawerAnimationIsPlaying, setCurrentSceneIndex } from '../store/WarehouseStore';
import { readState, writeState } from '../../../../business_layer/State';
import { off, on } from '../../../../business_layer/Event';
import { getCabinetDrawerAnimationIsPlayingEventName, getCabinetDrawerAnimationIsStopEventName, getEnterOperateCabinetModeEventName, getExitOperateCabinetModeEventName, getShowTipEventName } from '../../../../scene3d_layer/utils/EventUtils';
import { setMode } from '../../store/SceneStore';
import { mode as modeEnum } from '../../store/SceneStoreType';

let Warehouse: React.FC = () => {
    let mode = useSelector<AppState>((state) => state.scene.mode)
    let sceneNumber = useSelector<AppState>((state) => state.global.sceneNumber)
    let dispatch: AppDispatch = useDispatch()

    let _enterEventHandler = (state, { userData }) => {
        dispatch(setMode(modeEnum.Operate))

        return Promise.resolve(state)
    }

    let _exitEventHandler = (state, { userData }) => {
        dispatch(setMode(modeEnum.Default))

        return Promise.resolve(state)
    }

    let _isPlayingEventHandler = (state, { userData }) => {
        dispatch(setCabinetDrawerAnimationIsPlaying(true))

        return Promise.resolve(state)
    }

    let _isStopEventHandler = (state, { userData }) => {
        dispatch(setCabinetDrawerAnimationIsPlaying(false))

        return Promise.resolve(state)
    }


    let _renderBigScreenUI = (mode) => {
        switch (mode) {
            case modeEnum.Operate:
                return null
            case modeEnum.Default:
            default:
                // return (
                //     <Box1 />
                // )
                return null
        }
    }

    useEffect(() => {
        writeState(on(readState(), getEnterOperateCabinetModeEventName(), _enterEventHandler))
        writeState(on(readState(), getExitOperateCabinetModeEventName(), _exitEventHandler))

        writeState(on(readState(), getCabinetDrawerAnimationIsPlayingEventName(), _isPlayingEventHandler))
        writeState(on(readState(), getCabinetDrawerAnimationIsStopEventName(), _isStopEventHandler))

        return () => {
            writeState(off(readState(), getEnterOperateCabinetModeEventName(), _enterEventHandler))
            writeState(off(readState(), getExitOperateCabinetModeEventName(), _exitEventHandler))

            writeState(off(readState(), getCabinetDrawerAnimationIsPlayingEventName(), _isPlayingEventHandler))
            writeState(off(readState(), getCabinetDrawerAnimationIsStopEventName(), _isStopEventHandler))
        };
    }, []);

    return (
        <Layout className="park"
        >
            <Header description={`3D仓库-仓库${sceneNumber}`} />
            {
                _renderBigScreenUI(mode)
            }
            <Modal />
            <SwitchCamera />
            <OpereateCabinetMode />
        </Layout >
    );
};

export default Warehouse;