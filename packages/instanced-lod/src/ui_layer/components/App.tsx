import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import VConsole from 'vconsole';
import { useSelector } from 'react-redux'
import { getThirdPersonControlsJoystickZoneDomSize } from "../../business_layer/Scene3D";
import Global from '../global/components/Global';
import { AppState } from '../store/AppStore';
import { scene } from '../global/store/GlobalStoreType';
import { createState, readState, writeState } from '../../business_layer/State';
import * as Scene3D from '../../business_layer/Scene3D';
import { init, loop } from '../../business_layer/Loop';
import Scene from '../scene/component/Scene';
import { View } from 'meta3d-jiehuo-abstract';
import { loadCurrentSceneResource } from '../../business_layer/Loader';
import { isMobile } from '../../business_layer/Device';
import { Loading } from '../utils/loading/components/Loading';
import { Info } from '../utils/info/components/Info';

let App = () => {
    let _renderJoystickDom = () => {
        if (!isMobile()) {
            return null
        }

        return <div style={{
            "width": `${getThirdPersonControlsJoystickZoneDomSize()}px`,
            "height": `${getThirdPersonControlsJoystickZoneDomSize()}px`,
            "position": "absolute",
            "top": "30%",
            "left": "5%",
            "zIndex": "2",
            "display": "none"
        }} id="meta3d_joystick_zone"></div>
    }

    let currentScene = useSelector<AppState>((state) => state.global.currentScene) as scene
    let sceneNumber = useSelector<AppState>((state) => state.global.sceneNumber) as number

    let [isLoading, setIsLoading] = useState(true)
    let [percent, setPercent] = useState(0)
    let [isInit, setIsInit] = useState(false)

    useEffect(() => {
        // load(createState(), [
        //     {
        //         id: ParkScene3D.getResourceId(1),
        //         path: `./${ParkScene3D.getResourceId(1)}.glb`
        //     },
        // ], percent => setPercent(_ => percent))

        let config = {
            // isDebug: true,
            isDebug: false,

            // isProduction: true
            isProduction: false
        }



        let state = createState()

        state = Scene3D.setIsDebug(state, config.isDebug)
        state = Scene3D.setIsProduction(state, config.isProduction)

        // let _ = new VConsole()

        if (isMobile()) {
            if (!config.isProduction) {
                let _ = new VConsole()
            }
        }



        loadCurrentSceneResource(state, percent => setPercent(_ => percent), currentScene, sceneNumber).then(state => {
            setIsLoading(_ => false)
            setIsInit(_ => false)

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(state)
                }, 100)
            })
        }).then(state => {
            init(state, currentScene, sceneNumber).then(state => {
                setIsInit(_ => true)

                writeState(state)

                loop()
            })
        })
    }, []);

    return <Layout>
        {
            isLoading ?
                <Loading description="初始化" percent={percent} />
                :
                !isInit ?
                    <Info info="正在初始化" /> : <Layout.Content>
                        <Global />
                        <Scene />
                    </Layout.Content >
        }
        {_renderJoystickDom()}
        <canvas id="canvas" width={View.getWidth() + "px"} height={View.getHeight() + "px"} style={{
            "width": View.getWidth() + "px",
            "height": View.getHeight() + "px",
            // "opacity": isInit ? "1" : "0"
            // "position": "absolute",
            // "top": "0px",
            // "left": "0px",
            // "zIndex": 1
        }}></canvas>
    </Layout >
};

export default App;