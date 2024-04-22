import React, { useState, useEffect } from 'react';
import { Row } from 'antd';

export let Loading = ({ description, percent }) => {
    return <Row width="100%" align="middle" style={{"margin": "0 auto"}}>
        <img src="./image/png/logo.png" width="64px" height="64px" />
        <img src="./image/gif/loading.gif" width="100px" height="100ps" />
        {description + "加载中：" + percent.toString() + "%"}
    </Row >
};