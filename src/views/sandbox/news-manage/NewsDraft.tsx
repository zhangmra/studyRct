import React, {useEffect, useState} from 'react'

import {Space, Table, Tag, Button, Modal, message} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {DeleteOutlined,EditOutlined,ExclamationCircleFilled,UploadOutlined} from '@ant-design/icons';
import axios from "axios";
import {useNavigate} from "react-router-dom";
const { confirm } = Modal;

interface DataType {
    children?: any;
    rightId?: string;
    key: string;
    title: string;
    pagepermisson: number;
    id: string;
    tags: string[];
}

function NewsDraft() {
    const [datas,setdatas] = useState<DataType[]>([]);
    const token = localStorage.getItem("token");
    // @ts-ignore
    const { username } = JSON.parse(token);
    const navigate = useNavigate();
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            align:"center",
            render: (text) => <a>{text}</a>,
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            align:"center",
            render:(value, record, index)=>(
                <Space size={[0, 8]} wrap>
                    <a onClick={()=>{
                        navigate(`/news-manage/preview/${record.id}`)
                        console.log(record) }} color="green">{value}</a>
                </Space>
            )
        },
        {
            title: '作者',
            dataIndex: 'author',
            render:(value, record, index)=>(
                <Space size={[0, 8]} wrap>
                    <Tag color="green">{value}</Tag>
                </Space>
            )
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            align:"center",
            render:(category) => {
                return  category.title
            }
        },
        {
            title: '操作',
            key: 'action',
            align:"center",
            render: (value, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>{ showConfirm(value) }} shape="circle" danger icon={<DeleteOutlined />} />
                    <Button type="primary" onClick={()=>{ navigate(`/news-manage/update/${record.id }`) }} shape="circle" icon={<EditOutlined />} />
                    <Button onClick={()=>{ handleCheck(record) }} style={{background:"green",color:"#fff"}} type="default" shape="circle"  icon={<UploadOutlined />}></Button>
                </Space>
            ),
        },
    ];

    const handleCheck = (record:DataType) =>{
        axios.patch(`/news/${record.id}`,{
            auditState:1
        }).then((res)=>{
            navigate("/audit-manage/list");
            message.info(`请您到审核列表中查看新闻信息`)
        });
    }
    useEffect(()=>{
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res)=>{
            const list = res.data;
            console.log(list,'list')
            setdatas(list);
        })
    },[username]);
    const del= (item:any) =>{
        console.log(item,'item')
        setdatas(datas.filter(data=>data.id !== item.id ));
        axios.delete(`/news/${item.id}`);
    }
    const showConfirm = (value:Object) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '您确定要删除当前数据？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                del(value)
            }
        });
    };
    return (
        <div>
            <Table rowKey={item=>item.id} columns={columns} dataSource={datas} pagination={{
                pageSize:5
            }}/>
        </div>
    );
}

export default NewsDraft;

