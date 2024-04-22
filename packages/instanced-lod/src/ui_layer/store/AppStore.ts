import { configureStore } from '@reduxjs/toolkit'
import GlobalReducer from '../global/store/GlobalStore'
import SceneReducer from '../scene/store/SceneStore'
import LoadingReducer from '../scene/loading/store/LoadingStore'
import InfoReducer from '../scene/info/store/InfoStore'
import WarehouseReducer from '../scene/warehouse/store/WarehouseStore'

const store = configureStore({
  reducer: {
    global: GlobalReducer,
    scene: SceneReducer,
    loading: LoadingReducer,
    info: InfoReducer,
    warehouse: WarehouseReducer
  },
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
