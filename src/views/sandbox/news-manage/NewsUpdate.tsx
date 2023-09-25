import React, {useEffect, useState} from 'react'
import {Breadcrumb, Button, Form, Steps, Select, Input, message,notification} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";
import { isEmpty } from 'lodash';
import {useNavigate, useParams} from "react-router-dom";
const layout = {labelCol: { span: 4 }, wrapperCol: { span: 20 }};
const tailLayout = {wrapperCol: { offset: 4, span: 20 }};



interface IScate{
    id:number,
    title:string,
    value:string
}
interface ISform{
    title:string,
    id:number
}
function NewsUpdate() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const param = useParams();
    const regex = /<p><\/p>/g;
    const [ api ] = notification.useNotification();
    const [formInfo,setformInfo] = useState<ISform>({title:"",id:0});
    const [content ,setContent] = useState<any>(null);
    const [current,setcurrent] = useState<number>(0);
    const [categoriesList,setcategoriesList] = useState<IScate[]>([]);
    const token = localStorage.getItem("token");
    const [tokenVal,settokenVal] = useState<any>([]);
    useEffect(()=>{
        if (token){ settokenVal(JSON.parse(token)) }
        axios.get("/categories").then((res)=>{
            setcategoriesList(res.data);
        })
        axios.get(`/news/${param.id}?_expand=category&_expand=role`).then((res)=>{
            form.setFieldsValue({
                title:res.data.title,
                categoryId:res.data.categoryId
            });
            setContent(res.data.content);
        })
    },[param.id]);

    const onFinish = (values: any) => {
        console.log(values,"onFinish");
        setformInfo(values);
        setcurrent(1);
    };

    const handleSave=(val:number)=>{

        axios.patch(`/news/${param.id}`,{
            ...formInfo,
            "content": content,
            "region": tokenVal.region ? tokenVal.region : "全球 ",
            "author": tokenVal.username,
            "roleId": tokenVal.roleId,
            "auditState": val, //草稿0，提交审核1
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            "publishTime": 0
        }).then((res)=>{
            navigate(val=== 0? "/news-manage/draft" : "/audit-manage/list");

            message.info(`请您到${val === 0 ? "草稿箱":"审核列表"}中查看新闻信息`)

        });
    }
    return (
        <div>
            <Breadcrumb
                style={{fontSize:"20px",fontWeight:"500"}}
                items={[{title: <ArrowLeftOutlined />,href: '#/news-manage/draft',},{title: '更新新闻'}]}
            />
            <Steps
                size="small"
                current={current}
                items={[{
                    title: '基本信息',
                    description:'新闻标题，新闻分类'
                },
                    {
                        title: '新闻内容',
                        description:'新闻主体内容'
                    },
                    {
                        title: '新闻提交',
                        description:'保存草稿或者提交审核'
                    }]}
            />

            { current == 0 &&
                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{ marginTop:"40px" }}
                >
                    <Form.Item name="title" label="新闻标题" rules={[{ required: true,message: '请输入新闻标题' }]}>
                        <Input  placeholder="请输入新闻标题"/>
                    </Form.Item>
                    <Form.Item name="categoryId" label="新闻分类" rules={[{ required: true,message:'请选择新闻分类' }]}>
                        <Select
                            placeholder="请选择新闻类型"
                            allowClear
                            options={categoriesList}
                            fieldNames={{label:"title",value:"id"}}
                        />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">下一步</Button>
                    </Form.Item>
                </Form>
            }
            {current == 1 &&
                <div>
                    <NewsEditor getContent={(val:any)=>{ setContent(val) }} content={content}/>
                    <Button type="primary" onClick={()=>{
                        if(isEmpty(content)){
                            message.error("请撰写新闻内容")
                            return
                        }
                        setcurrent(2)
                    }}>下一步</Button>
                    <Button onClick={()=>{ setcurrent(0) }}>上一步</Button>
                </div>
            }
            {current == 2 &&
                <div>
                    <Button type="primary" onClick={()=>{ handleSave(0) }}>保存草稿</Button>
                    <Button type="primary" danger onClick={()=>{ handleSave(1) }}>提交审核</Button>
                    <Button onClick={()=>{ setcurrent(1) }}>上一步</Button>
                </div>
            }



        </div>
    );
}

export default NewsUpdate;