import { createSlice } from '@reduxjs/toolkit'
import { store } from './ParkStoreType'

let ParkSlice = createSlice<store, any, any, any, any>({
  // let ParkSlice = createSlice({
  name: 'Park',
  initialState: {
    currentSceneIndex: 1
  },
  reducers: {
    setCurrentSceneIndex: (state: store, data) => {
      let currentSceneIndex = data.payload

      state.currentSceneIndex = currentSceneIndex
    },
  },
  selectors: {

  }
})

// Action creators are generated for each case reducer function
export let { setCurrentSceneIndex }: any = ParkSlice.actions

export default ParkSlice.reducer

// export type ParkState = ReturnType<typeof ParkSlice.getInitialState>
// export type ParkDispatch = typeof ParkSlice.