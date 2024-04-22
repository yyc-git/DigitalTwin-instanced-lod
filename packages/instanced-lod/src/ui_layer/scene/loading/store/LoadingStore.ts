import { createSlice } from '@reduxjs/toolkit'
import { store } from './LoadingStoreType'

let LoadingSlice = createSlice<store, any, any, any, any>({
    name: 'Loading',
    initialState: {
        isLoading: false,
        percent: 0
    },
    reducers: {
        setIsLoading: (state: store, data) => {
            let isLoading = data.payload

            state.isLoading = isLoading
        },
        setPercent: (state: store, data) => {
            let percent = data.payload

            state.percent = percent
        },
    },
    selectors: {
    }
})

// Action creators are generated for each case reducer function
export let { setIsLoading, setPercent }: any = LoadingSlice.actions

export default LoadingSlice.reducer