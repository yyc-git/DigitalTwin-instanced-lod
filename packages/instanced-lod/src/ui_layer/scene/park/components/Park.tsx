import React, { useState, useEffect } from 'react';
import { Layout, List, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import Header from '../../header/components/Header';
import SwitchCamera from '../switch_camera/components/SwitchCamera';
import { AppDispatch, AppState } from '../../../store/AppStore';

let Park: React.FC = () => {
    // let sceneNumber = useSelector<AppState>((state) => state.global.sceneNumber)

    // let _renderBigScreenUI = () => {
    //     return null
    // }

    return (
        <Layout className="park"
        >
            {/* <Header description={`3D仓库-园区${sceneNumber}`} /> */}
            {/* {
                _renderBigScreenUI()
            } */}
            {/* <SwitchCamera /> */}
        </Layout >
    );
};

export default Park;