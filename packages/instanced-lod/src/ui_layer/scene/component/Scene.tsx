import "./_base.scss"
import "./Scene.scss"
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { Button, Layout } from 'antd';
import { scene } from '../../global/store/GlobalStoreType';
import Park from '../park/components/Park';
import Warehouse from '../warehouse/components/Warehouse';
import { AppState } from '../../store/AppStore';
import { debounce, setFontSize } from "../../utils/BigScreenUtils";
import { Loading } from "../loading/components/Loading";
import { View } from "meta3d-jiehuo-abstract";
import { isMobile } from "../../../business_layer/Device";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Tip } from "../tip/components/Tip";
import { Info } from "../info/components/Info";
import { Storage } from "meta3d-jiehuo-abstract";

let Scene: React.FC = () => {
    let _render = (currentScene, isSetFontSize, tips) => {
        if (!isSetFontSize) {
            return null
        }

        let scene_
        switch (currentScene) {
            case scene.Park:
                scene_ = <Park />
                break
            case scene.Warehouse:
            default:
                scene_ = <Warehouse />
                break
        }

        return NullableUtils.getWithDefault(NullableUtils.map(tips => {
            return <>
                <Tip tips={tips} setTipsFunc={setTips} />
                {scene_}
            </>
        }, tips),
            scene_
        )
    }

    let _isLandscape = () => {
        return View.getWidth() > View.getHeight()
    }

    let _isWeChatBrowser = () => {
        return /MicroMessenger/i.test(window.navigator.userAgent)
    }

    let _buildTipKey = () => "meta3d_is_show_thirdpersoncontrols_tip_once"

    let currentScene = useSelector<AppState>((state) => state.global.currentScene) as scene

    let [isSetFontSize, setIsSetFontSize] = useState(false)
    let [tips, setTips] = useState([])

    useEffect(() => {
        let cancalDebounce = debounce(setFontSize, 100)

        window.addEventListener('resize', cancalDebounce)

        setFontSize()

        /*! make datav-react -> 装饰 auto resize
        * 
        */
        setIsSetFontSize(_ => true)

        return () => {
            // 移除
            window.removeEventListener('resize', cancalDebounce)
        }
    }, [])

    useEffect(() => {
        let tips = []

        if (isMobile() && !_isLandscape()) {
            let tipTitle = "请横屏"
            let tipContent = ""

            if (_isWeChatBrowser()) {
                tipContent = `请将手机横屏，具体操作步骤如下：
1、在微信的“我”->“通用”中，开启横屏模式
2、开启手机的自动旋转
3、将手机横屏`
            }
            else {
                tipContent = `请将手机横屏，具体操作步骤如下：
1、开启手机的自动旋转
2、将手机横屏`
            }

            // setTips(tips => tips.concat([tipTitle, tipContent]))
            tips.push([tipTitle, tipContent])
        }

        let promise

        if (isMobile()) {
            promise = Storage.getItem<number>(_buildTipKey()).then(showedTimes => {
                if (!NullableUtils.isNullable(showedTimes) && NullableUtils.getExn(showedTimes) > 3) {
                    return tips
                }

                // setTips(_ => NullableUtils.return_(["第三人称相机使用说明", "请将左手拇指放到屏幕左方透明的操作杆上，右手拇指放到屏幕右方的任意位置。其中，左手控制人物移动，右手旋转屏幕视角"]))
                tips.push(["第三人称相机使用说明", "请将左手拇指放到屏幕左方透明的操作杆上，右手拇指放到屏幕右方的任意位置。其中，左手控制人物移动，右手旋转屏幕视角"])

                return Storage.setItem(_buildTipKey(), NullableUtils.getWithDefault(NullableUtils.map(showedTimes => showedTimes + 1, showedTimes),
                    1
                )).then(_ => tips)
            })
        }
        else {
            promise = Promise.resolve(tips)
        }

        promise.then(tips => {
            setTips(_ => tips)
        })
    }, [])

    return <Layout  >
        <Loading />
        <Info />
        {_render(currentScene, isSetFontSize, tips)}
    </Layout >
};

export default Scene;