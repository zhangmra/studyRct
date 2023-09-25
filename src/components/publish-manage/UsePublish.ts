import {useEffect, useState} from "react";
import axios from "axios";
import {message} from "antd";
interface Category{
    "id": number;
    "title": string;
    "value": string;
}
interface DataType {
    category:Category,
    "categoryId": number,
    "content":string,
    "region":string,
    "author": string,
    "roleId": number,
    "auditState": number,
    "publishState": number,
    "createTime": number,
    "star": number,
    "view": number,
    "id": number,
    "publishTime": number
}
function UsePublish(type:number){
    const token = localStorage.getItem("token");
    // @ts-ignore
    const { username } = JSON.parse(token);
    const [dataSource,setdataSource] = useState([]);
    useEffect(()=>{
        axios(`/news?username=${username}&publishState=${type}&_expand=category`).then((res)=>{
            console.log(res,'kkkk')
            setdataSource(res.data);
        })
    },[username]);
    const handlePublish = (id:number) => {
        setdataSource(dataSource.filter((data:DataType) => data.id !== id));
        axios
            .patch(`/news/${id}`, { publishState: 2, publishTime: Date.now() })
            .then((res) => {
                message.info("您可以到【发布管理-已发布】查看您的新闻");
            });
    };
    const handleSunset = (id:number) => {
        setdataSource(dataSource.filter((data:DataType) => data.id !== id));
        axios.patch(`/news/${id}`, { publishState: 3 }).then((res) => {
            message.info(`您可以到【发布管理-已下线】查看您的新闻`);
        });
    };
    const handleDelete = (id:number) => {
        setdataSource(dataSource.filter((data:DataType) => data.id !== id));
        axios.delete(`/news/${id}`).then((res) => {
            message.info("您已删除已下线的新闻");
        });
    };

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete,
    }
}
export default UsePublish