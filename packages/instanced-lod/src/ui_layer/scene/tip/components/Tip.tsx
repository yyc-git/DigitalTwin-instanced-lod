import React, { useState, useEffect } from 'react';
import { Button, Modal, Row } from 'antd';

export let Tip = ({ tips, setTipsFunc }) => {
    let _handle = (_) => {
        setTipsFunc(_ => tips.slice(1))
    }

    if (tips.length == 0) {
        return null
    }

    let [tipTitle, tipContent] = tips[0]

    return <Modal keyboard={false} maskClosable={false} title={tipTitle} open={true} onOk={_handle} onCancel={_handle}>
        <p>{tipContent}</p>
    </Modal>
};