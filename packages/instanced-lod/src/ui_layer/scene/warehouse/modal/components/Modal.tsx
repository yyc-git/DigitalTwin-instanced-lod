import React, { useState, useEffect } from 'react';
import { Button, Layout, List, Typography } from 'antd';
// import { useSelector, useDispatch } from 'react-redux'
// import { Bar } from '@ant-design/plots';
import { readState, writeState } from '../../../../../business_layer/State';
import { getShowModalEventName } from '../../../../../scene3d_layer/utils/EventUtils';
import { playCabinetDrawerGoInArticluatedAnimation } from '../../../../../business_layer/WarehouseScene3D';
import { on, off } from '../../../../../business_layer/Event';
import { NullableUtils } from 'meta3d-jiehuo-abstract';
import { View } from 'meta3d-jiehuo-abstract';
// import { setIsShowModal } from '../../store/WarehouseStore';

let Modal: React.FC = () => {
  // let isShowModal = useSelector<AppState>((state) => state.warehouse.isShowModal)
  // let dispatch = useDispatch()

  let _handleClose = (event) => {
    // dispatch(setIsShowModal(false))
    setIsShowModal(_ => false)

    writeState(playCabinetDrawerGoInArticluatedAnimation(readState()))
  };

  let _getDom = (id): HTMLElement => {
    return NullableUtils.getExn(document.querySelector("#" + id))
  }

  let _isInBottom = (screenCoordniate, height, viewHeight) => {
    return screenCoordniate[1] + height < viewHeight
  }

  let _isInUp = (screenCoordniate, height) => {
    return height < screenCoordniate[1]
  }

  let _isInRight = (screenCoordniate, width, viewWidth) => {
    return screenCoordniate[0] + width < viewWidth
  }

  let _isInLeft = (screenCoordniate, width) => {
    return width < screenCoordniate[0]
  }

  let _positionHorizontal = (screenCoordniate, width, viewWidth) => {
    if (_isInRight(screenCoordniate, width, viewWidth)) {
      return `${screenCoordniate[0]}px`
    }
    else if (_isInLeft(screenCoordniate, width)) {
      return `${screenCoordniate[0] - width}px`
    }
    else {
      return `${(viewWidth - width) / 2}px`
    }
  }

  let _computePosition = (id, screenCoordniate) => {
    let top = "0px"
    let left = "0px"

    let dom = _getDom(id)

    let viewWidth = View.getWidth()
    let viewHeight = View.getHeight()

    let width = dom.clientWidth
    let height = dom.clientHeight

    if (_isInBottom(screenCoordniate, height, viewHeight)) {
      top = `${screenCoordniate[1]}px`

      left = _positionHorizontal(screenCoordniate, width, viewWidth)
    }
    else if (_isInUp(screenCoordniate, height)) {
      top = `${screenCoordniate[1] - height}px`

      left = _positionHorizontal(screenCoordniate, width, viewWidth)
    }
    else {
      top = `${(viewHeight - height) / 2}px`

      left = _positionHorizontal(screenCoordniate, width, viewWidth)
    }

    return [top, left]
  }

  // export let hide = (id: string) => {
  //     let dom = _getDom(id)

  //     dom.style.display = "none"
  // }

  let _showModalEventHandler = (state, { userData }) => {
    // dispatch(setIsShowModal(true))
    setIsShowModal(_ => true)

    let {
      cabinerNumber,
      drawerNumber,
      screenCoordniate
    } = userData

    setCabinetNumber(_ => cabinerNumber as any)
    setDrawerNumber(_ => drawerNumber as any)
    // setScreenCoordniate(_ => screenCoordniate as any)

    let [top, left] = _computePosition("ui_page", screenCoordniate)

    setTop(_ => top)
    setLeft(_ => left)

    return Promise.resolve(state)
  }

  let [isShowModal, setIsShowModal] = useState(false)
  let [top, setTop] = useState("0px")
  let [left, setLeft] = useState("0px")
  let [cabinetNumber, setCabinetNumber] = useState(1)
  let [drawerNumber, setDrawerNumber] = useState(1)
  // let [screenCoordniate, setScreenCoordniate] = useState([])

  useEffect(() => {
    writeState(on(readState(), getShowModalEventName(), _showModalEventHandler))

    return () => {
      writeState(off(readState(), getShowModalEventName(), _showModalEventHandler))
    };
  }, []);

  // useEffect(() => {
  //   if (isShowModal) {
  //     show("ui_page", screenCoordniate)
  //   }
  // }, [isShowModal, screenCoordniate]);

  return (
    <Layout id={"ui_page"} style={
      // <Layout style={
      {
        "position": "absolute",
        "top": isShowModal ? top : "-1000px",
        "left": left,
        "zIndex": 3,
        // "display": isShowModal ? "block" : "none",
        "opacity": isShowModal ? "1" : "0",
        // "width": getWidth() * 0.8 + "px",
        "width": "300px",
        // "height": "300px"
      }
    }>

      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      {/* <Modal title="Basic Modal" open={isOpen} onOk={handleOk} onCancel={_handleClose}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal> */}

      {/* <Bar {...config} /> */}
      <Layout
        style={
          {
            "height": "200px",
          }
        }
      >
        {/* <List
        // header={<div>Header</div>}
        // footer={<div>Footer</div>}
        bordered
        dataSource={data2}
        renderItem={(item) => {
          // <List.Item className="">
            <List.Item.Meta >{item}</List.Item.Meta>
          // </List.Item>
        }}
      /> */}
        <Typography.Text mark>{`柜子编号：${cabinetNumber}`}</Typography.Text>
        <Typography.Text mark>{`抽屉编号：${drawerNumber}`}</Typography.Text>
        <Button type="primary" onClick={_handleClose}>
          关闭
        </Button>

      </Layout>
    </Layout >
  )
};

export default Modal;