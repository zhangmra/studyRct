import React, {useEffect, useState} from 'react'
import axios from "axios";
import {Button, Modal, Popover, Space, Switch, Table,Tree} from "antd";
import {ColumnsType} from "antd/es/table";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled, MenuOutlined} from "@ant-design/icons";
import type { DataNode } from 'antd/es/tree'
const { confirm } = Modal;
interface DataType {
    id:number,
    roleName:string,
    roleType:number,
    rights:string[]
}
function RoleList() {
    const [DataSource,setDataSource] = useState<DataType[]>([]);
    const [rightsDataSource,setRightsDataSource] = useState<DataNode[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectonCheck,setselectonCheck] = useState([]);
    const [currentId,setcurrentId] = useState(0)
    const [currentCheckedKeys, setCurrentCheckedKeys] = useState([]);
    useEffect(()=>{
        axios.get("/roles").then((res)=>{
            setDataSource(res.data);
        });
        axios.get("/rights?_embed=children").then((res)=>{
            setRightsDataSource(res.data);
        })
    },[]);
    // @ts-ignore
    const columns: ColumnsType<DataType> = [
        {
        title: 'ID',
        dataIndex: 'id',
        align:"center",
        render: (text) => <a>{text}</a>,
    },{
        title: '角色名称',
        dataIndex: 'roleName',
        align:"center",
    },{
        title: '操作',
        key: 'action',
        align:"center",
        render: (value, record) => (
            <Space size="middle">
                <Button type="primary" onClick={()=>{ showConfirm(value) }} shape="circle" danger icon={<DeleteOutlined />} />
                <Button type="primary" onClick={()=>{ showModal(value) }} shape="circle"  icon={<MenuOutlined />} />

            </Space>
        ),
    }];

    const onCheck = (checkedKeys:any) => {
        console.log(checkedKeys,"onCheck")
        setCurrentCheckedKeys(checkedKeys.checked);
    };

    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
    };




    const showModal = (item:any) => {
        setIsModalOpen(true);
        setcurrentId(item.id)
        setCurrentCheckedKeys(item.rights);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        console.log(currentCheckedKeys);
        setDataSource(
            DataSource.map((data) => {
                if (data.id === currentId) {
                    return {
                        ...data,
                        rights: currentCheckedKeys,
                    };
                }
                return data;
            })
        );
        console.log(currentId,'currentId')
        axios.patch(`/roles/${currentId}`,{
            rights:currentCheckedKeys
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showConfirm = (value:Object) => {
        console.log(value,'999')
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '您确定要删除当前数据？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {  del(value) }
        });
    };
    const del= (item:any) =>{
        console.log(item,'item')
        axios.delete(`/roles/${item.id}`)

    }
    return (
        <div>
            <Table columns={columns} rowKey={record => record.id} dataSource={DataSource} pagination={{ pageSize:5 }}/>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentCheckedKeys}
                    treeData={rightsDataSource}
                    checkStrictly={true}
                    onCheck={onCheck}
                />
            </Modal>
        </div>
    );
}

export default RoleList;