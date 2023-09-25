import React, {useEffect, useState} from 'react'

import { Space, Table, Tag,Button ,Modal,Popover,Switch} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {DeleteOutlined,EditOutlined,ExclamationCircleFilled} from '@ant-design/icons';
import axios from "axios";
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
const data: DataType[] = [];

function RightList() {
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            align:"center",
            render: (text) => <a>{text}</a>,
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            align:"center"
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render:(value, record, index)=>(
                <Space size={[0, 8]} wrap>
                    <Tag color="green">{value}</Tag>
                </Space>
            )
        },
        {
            title: '操作',
            key: 'action',
            align:"center",
            render: (value, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>{ showConfirm(value) }} shape="circle" danger icon={<DeleteOutlined />} />
                    <Popover content={(
                        <div style={{textAlign:"center"}}>
                            <Switch checkedChildren="开启" onClick={()=> { switchChage(value) } } checked={ value.pagepermisson === 1 ? true : false } unCheckedChildren="关闭" />
                        </div>
                    )} title="页面配置项" trigger={ value.pagepermisson === undefined ? [] : "click"} >
                        <Button type="primary" shape="circle" disabled={value.pagepermisson == undefined} icon={<EditOutlined />} />
                    </Popover>
                </Space>
            ),
        },
    ];
    const switchChage = (value:any) =>{
        value.pagepermisson = value.pagepermisson === 1 ? 0 : 1;
        setdatas([...datas]); //跟新数据
        if (value.grade == 1){
            axios.patch(`/rights/${value.id}`,{
                pagepermisson:value.pagepermisson
            })
        }else {
            axios.patch(`/children/${value.id}`,{
                pagepermisson:value.pagepermisson
            })
        }
    }
    const [datas,setdatas] = useState<DataType[]>([]);
    useEffect(()=>{
        axios.get("/rights?_embed=children").then((res)=>{
            const list = res.data;
            list.forEach((item:any)=>{
                if (item.children.length === 0){
                    item["children"] = "";
                }
            })
            setdatas(list);
        })
    },[]);
    const del= (item:any) =>{
        console.log(item,'item')
        if (item.grade == 1 ){
            axios.delete(`/rights/${item.id}`)
        }else {
            let oneData =  datas.filter((val) => val.id === item.rightId);
            oneData[0].children = oneData[0].children.filter((data:any) => data.id !== item.id);
            axios.delete(`/children/${item.id}`);
            console.log(oneData[0].children ,'children')
            setdatas([...datas,...oneData]);
            console.log(oneData,'pp')
        }

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
            <Table columns={columns} dataSource={datas} pagination={{
                pageSize:5
            }}/>
        </div>
    );
}

export default RightList;

