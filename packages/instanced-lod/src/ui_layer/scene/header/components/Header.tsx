import "./Header.scss"
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Button, Layout, List, Typography } from 'antd';
import { Decoration5, Decoration8 } from '@jiaminghi/data-view-react'
import { AppState } from "../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";

let Header: React.FC = ({ description }) => {
    let info = useSelector<AppState>((state) => state.info.info)

    return (
        NullableUtils.isNullable(info) ?
            <Layout className="head">
                {/* <Decoration8 style={{ width: '300px', height: '70px' }} /> */}
                <div className="head-title">
                    <span>{description}</span>
                    {/* <Decoration5 style={{ width: '10rem', height: '1rem' }}></Decoration5> */}
                    <Decoration5 ></Decoration5>
                    {/* <Decoration5 key={Math.random().toString()} ></Decoration5> */}
                </div>
                {/* <Decoration8 reverse={true} style={{ width: '300px', height: '70px' }} /> */}
            </Layout> : null
    );
};

export default Header;