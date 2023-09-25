import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {Breadcrumb, Col, Row} from "antd";
import {HomeOutlined,HeartTwoTone} from "@ant-design/icons";
import moment from "moment/moment";
import axios from "axios";

function Detaile() {
    const param = useLocation();
    const navigate = useNavigate();
    const [newsInfo,setnewsInfo] = useState<any>(null);
    console.log(param.state.id,"param")
    useEffect(()=>{
        axios.get(`/news/${param.state.id}?_expand=category&_expand=role`).then((res)=>{
            setnewsInfo({...res.data,view:res.data.view + 1});
            return res.data
        }).then((res)=>{
            axios.patch(`/news/${param.state.id}`,{
                view:res.view + 1
            })
        })
    },[param.state.id]);
    const handleStar =()=>{
        setnewsInfo({...newsInfo,star:newsInfo.star + 1});
        axios.patch(`/news/${param.state.id}`,{
            star:newsInfo.star + 1
        })
    }
    return (
        <div style={{
            width:"95%",
            margin:"0 auto"
        }}>
            <Breadcrumb
                style={{fontSize:"30px"}}
                items={[
                    {
                        onClick:()=>{ navigate(-1) },
                        title: <HomeOutlined />,
                    },
                    {title: newsInfo?.title},
                    {title:newsInfo?.category.title},
                    {
                        title:<HeartTwoTone twoToneColor="#eb2f96" />,
                        onClick:()=>{ handleStar() }
                    }
                ]}
             />


            { newsInfo &&

                <Row gutter={[20, 20]} style={{marginTop:"20px"}}>
                    <Col span={8} >创作者:{newsInfo.author}</Col>
                    <Col span={8} >发布时间:{ newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : "-" }</Col>
                    <Col span={8} >区域:{newsInfo.region}</Col>

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

export default Detaile;
