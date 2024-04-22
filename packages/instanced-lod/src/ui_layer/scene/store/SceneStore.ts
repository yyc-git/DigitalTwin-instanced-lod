import { createSlice } from '@reduxjs/toolkit'
import { mode, store } from './SceneStoreType'

let SceneSlice = createSlice<store, any, any, any, any>({
    name: 'Scene',
    initialState: {
        mode: mode.Default
    },
    reducers: {
        setMode: (state: store, data) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes.
            // Also, no return statement is required from these functions.

            let mode = data.payload

            state.mode = mode
        },
    },
    selectors: {
    }
})

// Action creators are generated for each case reducer function
export let { setMode }: any = SceneSlice.actions

export default SceneSlice.reducer