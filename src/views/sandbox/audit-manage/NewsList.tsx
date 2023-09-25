import React, {useEffect, useState} from 'react'
import axios from "axios";
import {Button, message, Space, Table, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {useNavigate} from "react-router-dom";
interface DataType {
    auditState:number,
    author:string,
    category:object,
    categoryId:number,
    content:string,
    createTime:number,
    id:number,
    publishState:number,
    region:string,
    roleId:number,
    star:number,
    title:string,
    view:number
}
const auditList = [
    <Tag>未审核</Tag>,
    <Tag color="orange">审核中</Tag>,
    <Tag color="green">已通过</Tag>,
    <Tag color="red">未通过</Tag>,
];
function NewsList() {
    const navigate = useNavigate();
    const [datas,setdatas] = useState([]);
    const token = localStorage.getItem("token");
    // @ts-ignore
    const { username } = JSON.parse(token);
    useEffect(()=>{
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res)=>{
            console.log(res.data,'kkkkkk')
            setdatas(res.data);
        });
    },[]);
    const handleUpdate = (id:number) => {
        navigate(`/news-manage/update/${id}`);
    };

    const handlerevoke = (id:number) => {
        setdatas(datas.filter((item:any,index:number)=>item.id !== id));
        setdatas(datas.filter((data:any) => data.id !== id));
        axios.patch(`/news/${id}`, { auditState: 0 }).then((res) => {
             // props.history.push(`/news-manage/draft`);
            message.info(`你可以到草稿箱中查看您的新闻`);
        });
    };

    const handlePublish = (id:number) => {
        axios.patch(`/news/${id}`, { publishState: 2, publishTime: Date.now() })
            .then((res) => {
                navigate('/publish-manage/published')
                message.info(`你可以到[发布管理-已发布]中查看您的新闻`);
            });
    };
    const columns: ColumnsType<DataType> = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            align:"center",
            render: (text,item) => <a href={`#/news-manage/preview/${item.id}`}>{text}</a>,
        },
        {
            title: '作者',
            dataIndex: 'author',
            align:"center"
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            align:"center",
            render:(value)=>{
                return <div>{value.title}</div>
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render:(value, record, index)=> {
                return  <Space size={[0, 8]} wrap> { auditList[value] } </Space>
            }
        },
        {
            title: '操作',
            key: 'action',
            align:"center",
            render: (value, record) => (
                <Space size="middle">
                    {record.auditState === 1 &&
                        <Button type="primary"  onClick={()=>{ handlerevoke(record.id) }} > 撤销 </Button>
                    }
                    {record.auditState === 2 &&
                        <Button type="primary" danger ghost onClick={()=>{ handlePublish(record.id) }} > 发布 </Button>
                    }
                    {record.auditState === 3 &&
                        <Button type="dashed" block onClick={()=>{ handleUpdate(record.id) }} > 更新 </Button>
                    }
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table rowKey={item=>item.id} columns={columns} dataSource={datas} pagination={{
                pageSize:5
            }}/>
        </div>
    );
}

export default NewsList;