import { baseQuranApi, baseServerApi } from "./api/baseApi";
import playerReducer from "./features/playerSlice";

export const reducer = {
  player: playerReducer,
  [baseServerApi.reducerPath]: baseServerApi.reducer,
  [baseQuranApi.reducerPath]: baseQuranApi.reducer,
};
