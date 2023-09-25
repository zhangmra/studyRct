import { Breadcrumb ,Col, Row, Slider} from 'antd';
import React, {useEffect, useState} from 'react'
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import moment from 'moment';

function NewsPreview() {
    const param = useParams()
    const navigate = useNavigate();
    const [newsInfo,setnewsInfo] = useState<any>(null);
    const auditList = ["未审核",'审核中','已通过','未通过'];
    const colorList = ["black","orange","green","red"];
    const publishList = ["未发布",'待发布','已上线','已下线'];
    useEffect(()=>{
        axios.get(`/news/${param.id}?_expand=category&_expand=role`).then((res)=>{
            setnewsInfo(res.data);
        })
    },[param]);
    return (
        <div>
            <Breadcrumb
                items={[
                    {
                        onClick:()=>{ navigate(-1) },
                        title: <HomeOutlined />,
                    },
                    {title: newsInfo?.title},
                    {title:newsInfo?.category.title}
                ]}
            />
                { newsInfo &&

                    <Row gutter={[20, 20]} style={{marginTop:"20px"}}>
                        <Col span={8} >创作者:{newsInfo.author}</Col>
                        <Col span={8} >创建时间:{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Col>
                        <Col span={8} >发布时间:{ newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : "-" }</Col>

                        <Col span={8} >区域:{newsInfo.region}</Col>
                        <Col span={8} >审核状态:<span style={{color:colorList[newsInfo.auditState]}}>{auditList[newsInfo.auditState]}</span></Col>
                        <Col span={8} >发布状态:<span style={{color:colorList[newsInfo.auditState]}}>{publishList[newsInfo.publishState]}</span> </Col>

                        <Col span={8} >访问数量:{newsInfo.view}</Col>
                        <Col span={8} >点赞数量:{newsInfo.star}</Col>
                        <Col span={8} >评论数量:0 </Col>
                    </Row>
                }
            <div style={{border:"1px solid #e5e5e5",marginTop:"20px"}} dangerouslySetInnerHTML={{
                __html:newsInfo?.content
            }}></div>
        </div>
    );
}

export default NewsPreview;