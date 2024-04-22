import { createSlice } from '@reduxjs/toolkit'
import { store } from './InfoStoreType'

let InfoSlice = createSlice<store, any, any, any, any>({
    name: 'Info',
    initialState: {
        info: null
    },
    reducers: {
        setInfo: (state: store, data) => {
            let info = data.payload

            state.info = info
        },
    },
    selectors: {
    }
})

// Action creators are generated for each case reducer function
export let { setInfo }: any = InfoSlice.actions

export default InfoSlice.reducer