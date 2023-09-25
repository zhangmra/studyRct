import axios from "axios";
import {store} from "../redux/Store";
import {setisLoading} from "../redux/reducers/loading/LoadingReducer";


axios.defaults.baseURL="http://localhost:5000";

// Add a request interceptor请求前
axios.interceptors.request.use(function (config) {
    // Do something before request is sent

    // store.dispatch({
    //     type:"LoadingReducer",
    //     payloading:true
    // })

    store.dispatch(setisLoading({isLoading:true}));

    return config;
}, function (error) {
    setTimeout(()=>{
        store.dispatch(setisLoading({isLoading:false}));
    },500);
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor 请求后
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    setTimeout(()=>{
        store.dispatch(setisLoading({isLoading:false}));
    },500);
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    setTimeout(()=>{
        store.dispatch(setisLoading({isLoading:false}));
    },500);
    return Promise.reject(error);
});