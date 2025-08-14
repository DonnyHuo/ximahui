import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["version"]
  // blacklist: ["someReducer"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"]
      }
    })
});
const persistor = persistStore(store);

export { store, persistor };
