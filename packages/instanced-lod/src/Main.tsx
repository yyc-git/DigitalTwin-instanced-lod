import 'antd/dist/reset.css'
// import '@ant-design/flowchart/dist/index.css'

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
// import store from "./MainStore"


import App from './ui_layer/components/App';
import store from './ui_layer/store/AppStore';
import { View } from 'meta3d-jiehuo-abstract';

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    // @ts-ignore
    <Provider store={store}>
        <App />
    </Provider>,
)