import React, { useState, useEffect } from 'react';
import { Row } from 'antd';

export let Info = ({ info }) => {
    return <Row width="100%" align="middle" style={{ "position": "absolute", "top": "0", "left": "0", "zIndex": "100", "backgroundColor": "white", "width": "100%" }}>
        <div style={{ "margin": "0 auto", "position": "relative" }}>
            <img src="./image/png/logo.png" width="64px" height="64px" />
            <img src="./image/gif/loading.gif" width="100px" height="100ps" />
            {info}
        </div>
    </Row >
};