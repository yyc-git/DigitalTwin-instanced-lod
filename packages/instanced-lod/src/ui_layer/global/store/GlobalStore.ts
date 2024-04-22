import { createSlice } from '@reduxjs/toolkit'
import { scene, store } from './GlobalStoreType'

let GlobalSlice = createSlice<store, any, any, any, any>({
  // let GlobalSlice = createSlice({
  name: 'Global',
  initialState: {
    currentScene: scene.Park,
    // currentScene: scene.Warehouse,
    sceneNumber: 1
  },
  reducers: {
    setCurrentScene: (state: store, data) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.

      let { currentScene, sceneNumber } = data.payload

      state.currentScene = currentScene
      state.sceneNumber = sceneNumber
    },
  },
  selectors: {

  }
})

// Action creators are generated for each case reducer function
export let { setCurrentScene }: any = GlobalSlice.actions

export default GlobalSlice.reducer

// export type GlobalState = ReturnType<typeof GlobalSlice.getInitialState>
// export type GlobalDispatch = typeof GlobalSlice.