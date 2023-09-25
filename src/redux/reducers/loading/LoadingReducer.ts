import { createSlice ,PayloadAction} from "@reduxjs/toolkit";
import { LoadingState } from "./interface";


const initialState:LoadingState = {
    isLoading: false,
}
//PayloadAction：是 Redux Toolkit 中的一个类型，它用于定义 action 的结构以及传递给 reducer 的数据
//创建切片对象
const LoadingReducerSlice = createSlice({
    name:"LoadingReducer", //唯一表示
    initialState,   //初始化状态数据
    reducers:{      //1.定义reducers
        //2.定义reducer更新状态数据的函数 ，setisCollapsed方法在后期组件中执行dispatch时是作为action函数的函数名去使用
        setisLoading(state,{ payload }: PayloadAction<LoadingState>){ //传入两个参数1state(代理的proxy对象),一个是action
            state.isLoading = payload.isLoading
        }
    }
})

export const {
    setisLoading
} = LoadingReducerSlice.actions ;

export default LoadingReducerSlice.reducer;



