import React, {useEffect, useState} from 'react'

import { Space, Table, Tag,Button ,Modal,Popover,Switch,Form, FormInstance, Input, Select} from 'antd';
import {DeleteOutlined,EditOutlined,ExclamationCircleFilled} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from "axios";
import "./UserListCss.scss";
import UserForm from "../../../components/user-manage/UserForm";
import {values} from "lodash";
const { confirm } = Modal;

interface DataType {
    id: string;
    default:boolean,
    record:any
}
const data: DataType[] = [];
enum roleObj{
    "surperadmin" = 1,
    "admin",
    "editor"
}
function UserList() {
    const [datas,setdatas] = useState<DataType[]>([]);
    const [isModalOpen,setisModalOpen] = useState(false);
    const [isModaUpdatelOpen,setisModaUpdatelOpen] = useState(false);
    const [isUpdateDisabled,setisUpdateDisabled] = useState(false);
    const [roleList,setroleList] = useState<any>([]);
    const [regionList,setregionList] = useState([]);
    const [current,setcurrent] = useState<any>(null);
    const token = localStorage.getItem("token");
    // @ts-ignore
    const { roleId,region,username } = JSON.parse(token);
    const [form]= Form.useForm();
    const [ updateform ]= Form.useForm();

    useEffect(()=>{
        axios.get("/users?_expand=role").then((res)=>{
            const list = res.data;
            setdatas(roleId=== 1 ? list : [
                ...list.filter((u:any) => u.id === roleId || u.username === username),
                ...list.filter(
                    (u:any) => u.region === region && u.roleId > roleId
                ),
            ]);
        });
        axios.get("/regions").then((res)=>{
            const list = res.data;
            setregionList(list);
        });
        axios.get("/roles").then((res)=>{
            const list = res.data;
            setroleList(list);
        });
    },[roleId,region,username]);
    const columns: ColumnsType<DataType> = [
        {
            title: '区域',
            dataIndex: 'region',
            align:"center",
            filters:[
                ...regionList.map((region:any) => {
                    return {
                        text: region.title,
                        value: region.value,
                    };
                }),
                {
                    text: "全球",
                    value: "全球",
                },
            ],
            onFilter: (value, record:any) => {
                if (value === "全球") {
                    return record.region === "";
                } else {
                    return record.region === value;
                }
            },
            render: (text) => <a>{text ? text : "全球"}</a>,
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            align:"center",
            render:(item)=> {
                return item?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            render:(value, record, index)=>(
                <Space size={[0, 8]} wrap>
                    <Tag color="green">{value}</Tag>
                </Space>
            )
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render:(value, record, index)=>(
                <Space size={[0, 8]} wrap>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={() => handleChange(record)} checked={value} disabled={record.default}/>
                </Space>
            )
        },
        {
            title: '操作',
            key: 'action',
            align:"center",
            render: (value, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>{ showConfirm(value) }} shape="circle" danger icon={<DeleteOutlined />} disabled={value.default}/>
                    <Popover content={(
                        <div style={{textAlign:"center"}}>
                            <Switch checkedChildren="开启" checked={ value.pagepermisson === 1 ? true : false } unCheckedChildren="关闭" />
                        </div>
                    )} title="页面配置项" trigger={ value.pagepermisson === undefined ? [] : "click"} >
                        <Button type="primary" onClick={()=>{handleUpdate(record)}} shape="circle" icon={<EditOutlined />} disabled={value.default}/>
                    </Popover>
                </Space>
            ),
        },
    ];
    const handleChange = (item:any) => {
        item.roleState = !item.roleState;
        setdatas([...datas,item]);
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState,
        });
    };
    const handleUpdate = (item:any) =>{
        console.log(item,'items')
        setisModaUpdatelOpen(true);
        if (item.roleId === 1){
            setisUpdateDisabled(true);
        }else{
            setisUpdateDisabled(false);
        }
        setcurrent(item);
        updateform.setFieldsValue(item)
    }
    const updateForm =()=>{
        setisModaUpdatelOpen(true);
        updateform.validateFields().then((res)=>{
            axios.patch(`/users/${current.id}`,res);
            setdatas(
                datas.map((dataval)=>{
                    if (dataval.id === current.id){
                        return {
                            ...dataval,
                            ...res,
                            role: roleList.filter(
                                (role:any) => role.id === res.roleId
                            )[0],
                        }
                    }
                    return dataval;
                })
            )
            setisUpdateDisabled(!isUpdateDisabled);
            setisModaUpdatelOpen(false);

        }).catch((err)=>{
            console.log(err)
        })
    }
    const addForm =()=>{
        setisModalOpen(true)
        // formRef.current?.validateFields().then((res)=>{
        //     console.log(res,"res")
        // }).catch((err)=>{
        //     console.log(err,"err")
        // });
        form.validateFields().then((value)=>{
            console.log(value,"res")
            axios.post("/users",{
                "username": value.username,
                "password": value.password,
                "region": value.region ? value.region : "全球",
                "roleId": value.roleId,
                "roleState": true,
                "default": false,
            }).then((res)=>{
                console.log(res.data,'opopopop')
                setisModalOpen(false)
                setdatas([...datas,res.data]);
                // axios.get("http://localhost:5000/users?_expand=role").then((res)=>{
                //     const list = res.data;
                //     setdatas(list);
                // });
                setdatas([...datas,{
                    ...res.data,
                    role:roleList.filter((items:any)=>{return items.id === value.rolId })[0]

                }]);
                console.log(datas,'datasssss')
                form.resetFields(); //重置清空
            })

        }).catch((err)=>{
            console.log(err,"err")
        })
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
    const del= (item:any) =>{
        console.log(item,'item')
        setdatas(datas.filter(data=>data.id !== item.id));
        axios.delete(`/users/${item.id}`);
    }

    return (
        <div>
            <Button type="primary" style={{ marginBottom: 16 }} onClick={()=>{ setisModalOpen(true) }}>添加用户</Button>
            <Table rowKey={item=>item.id} columns={columns} dataSource={datas} pagination={{
                pageSize:5
            }}/>

            <Modal  width={700} title="添加用户" okText="确定" cancelText="取消"  open={isModalOpen} onOk={()=>{addForm()}} onCancel={()=>{ setisModalOpen(false) }}>
                <UserForm form={form}  regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled}/>
            </Modal>
            <Modal  width={700} title="更新用户" okText="确定" cancelText="取消"  open={isModaUpdatelOpen} onOk={()=>{updateForm()}} onCancel={()=>{
                setisModaUpdatelOpen(false)
                setisUpdateDisabled(!isUpdateDisabled);
            }}>
                <UserForm form={updateform}  regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled}/>
            </Modal>
        </div>
    );
}

export default UserList;


