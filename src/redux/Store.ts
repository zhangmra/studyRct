import {combineReducers, configureStore} from "@reduxjs/toolkit";

/**
 * redux持久化引入
 * */
import { persistStore, persistReducer } from 'redux-persist'
// @ts-ignore
import storage from 'redux-persist/lib/storage';

/***
 * reducer引入
 * */
import CollapsedReducer  from "./reducers/collapsed/CollapsedReducer";
import LoadingReducer from "./reducers/loading/LoadingReducer";

const persistConfig = {
    key: `root`,
    version: 1,
    storage,
    blacklist: [], //黑名单配置
    whitelist: ['CollapsedReducer', 'LoadingReducer'], // 需要持久化的项
};


//合并多个reducers
const rootReducer = combineReducers({CollapsedReducer,LoadingReducer});

// 数据持久化
const persistedReducer = persistReducer(persistConfig, rootReducer);


//rtk的configureStore集成了redux中的combineReducers，createStore,middleware以及默认支持reduxDevTools;
const store = configureStore({
    reducer:persistedReducer
});

const persistor = persistStore(store)
export {
    store,
    persistor
};

/**
 * returnType:可以获取返回值的类型，使代码更具可维护性和可读性，
 * 特别是在处理复杂的函数类型时，可以减少手动定义类型的工作，
 * 同时增加了代码的类型安全性。它在编写高度类型化的代码或使用泛型函数时特别有用。
 * */
export type AppDispatch = typeof store.dispatch; //获取修改方法
export type RootState = ReturnType<typeof store.getState>; //获取设置的状态变量








//combineReducers：合并链接多个reducer
// const reducer = combineReducers({
//     CollapsedReducer
// })
