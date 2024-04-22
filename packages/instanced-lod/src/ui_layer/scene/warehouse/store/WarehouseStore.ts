import { createSlice } from '@reduxjs/toolkit'
import { store } from './WarehouseStoreType'

let WarehouseSlice = createSlice<store, any, any, any, any>({
  // let WarehouseSlice = createSlice({
  name: 'Warehouse',
  initialState: {
    cabinetDrawerAnimationIsPlaying: false,
    // isShowModal: false,
    currentSceneIndex: 1
  },
  reducers: {
    setCabinetDrawerAnimationIsPlaying: (state: store, data) => {
      let isPlaying = data.payload

      state.cabinetDrawerAnimationIsPlaying = isPlaying
    },
    // setIsShowModal: (state: store, data) => {
    //   let isShowModal = data.payload

    //   state.isShowModal = isShowModal
    // },
    setCurrentSceneIndex: (state: store, data) => {
      let currentSceneIndex = data.payload

      state.currentSceneIndex = currentSceneIndex
    },
  },
  selectors: {

  }
})

// Action creators are generated for each case reducer function
export let { setCabinetDrawerAnimationIsPlaying,  setCurrentSceneIndex }: any = WarehouseSlice.actions

export default WarehouseSlice.reducer

// export type WarehouseState = ReturnType<typeof WarehouseSlice.getInitialState>
// export type WarehouseDispatch = typeof WarehouseSlice.