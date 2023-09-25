import { TypedUseSelectorHook, useSelector,useDispatch } from 'react-redux';
import {AppDispatch, RootState } from "./Store"; // 导入你的 RootState

/**
 * TypedUseSelectorHook：可以·提高代码维护与可读性减少重复类型注解
 * RootState:是数据类型
 * */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; //全局使用useAppSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
