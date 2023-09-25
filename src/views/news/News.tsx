import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import {Breadcrumb, Card, Col, List, Row, Typography} from "antd";
function News() {
    const navigate = useNavigate();
    const [list, setList] = useState<any>([]);
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category").then((res) => {
            console.log(
                Object.entries(_.groupBy(res.data, (item) => item.category.title))
            );
            setList(Object.entries(_.groupBy(res.data, (item) => item.category.title)));
        });
    },[]);
    const data = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.',
    ];
    return (
        <div style={{
            width:"95%",
            margin:"0 auto"
        }}>
            {/*<button onClick={()=>{*/}
            {/*    navigate('/detaile',{state:{*/}
            {/*        id:111*/}
            {/*    }});*/}
            {/*}}>跳转</button>*/}
            <Breadcrumb
                style={{fontSize:"30px"}}
                items={[
                    {title: "全球大新闻"},
                ]}
            />


            <Row gutter={[16,16]}>
                {list.map((item:any)=>{
                    return <Col span={8} key={item[0]}>
                        <Card hoverable={true} title={item[0]} bordered={false}>
                            <List
                                dataSource={item[1]}
                                pagination={{
                                    pageSize:3
                                }}
                                renderItem={(data:any) => (
                                    <List.Item onClick={()=>{
                                        navigate('/detaile',{state:{ id:data.id }})
                                    }}>
                                        <Typography.Text mark>{data.title}</Typography.Text>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                })}

            </Row>
        </div>
    );
}

export default News;