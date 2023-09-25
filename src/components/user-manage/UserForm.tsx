import React, {forwardRef, useEffect, useState} from 'react'
import {Form, FormInstance, Input, Select} from "antd";
interface  IRole{
    id:number,
    label:string,
    rights:string[],
    roleName:string,
    roleType:number,
    value:string
}
interface IRegion{
    id:number,
    title:string,
    value:string
}
interface IProps{
    roleList:Array<IRole>,
    regionList: Array<IRegion>,
    form:any,
    isUpdateDisabled:boolean
}
//forwardRef组件透传
const UserForm = forwardRef((props:IProps,ref:any) => {
    const layout = { labelCol: { span: 4 },  wrapperCol: { span: 16 } };
    const [isdisabled,setdisabled] = useState<boolean>(false);
    const token = localStorage.getItem("token");
    // @ts-ignore
    const { roleId , region} = JSON.parse(token);
    useEffect(()=>{
        setdisabled(props.isUpdateDisabled);
        checkRegionDisabled();
        isRoleDisabled();
    },[props.isUpdateDisabled])
    const checkRegionDisabled =() =>{
        if (roleId === 1){
            return false;
        }else{
            // return props.form.getFieldValue().region !== region ;
            let newlist =  props.regionList.filter((item)=>item.value !== region)
            newlist.forEach((item:any)=>{
                item["disabled"] = true;
            })
            return [...props.regionList,...newlist];
        }
    }
    const isRoleDisabled=()=>{
        if (roleId === 1){
            return false;
        }else{
            let newlist =  props.roleList.filter((item)=>item.id <= roleId )
            newlist.forEach((item:any)=>{
                item["disabled"] = true;
            });
            return [...props.roleList,...newlist];
        }
    }
    return (
        <div>
            <Form
                {...layout}
                ref={ ref }
                form={props.form}
                name="用户名"
                style={{ maxWidth: 600 }} >
                <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item rules={ isdisabled ? [] : [{ required: true, message: '请选择好区域' }]} label="区域" name="region">
                    <Select options={props.regionList}   />
                </Form.Item>
                <Form.Item rules={[{ required: true, message: '请选择角色' }]} label="角色" name="roleId">
                    <Select fieldNames={{label:"roleName",value:"id"}} onChange={(value)=>{
                        if (value === 1){
                            setdisabled(true);
                            props.form.setFieldsValue({ region:"" })
                        }else{ setdisabled(false) }
                    }} options={props.roleList}/>
                </Form.Item>
            </Form>
        </div>
    );
})

export default UserForm;