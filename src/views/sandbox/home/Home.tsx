import {Avatar, Card, Col, Drawer, List, Row, Typography } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import React, {useEffect, useRef, useState} from 'react'
import axios from "axios";
import {HomeState} from "./interface";
import * as Echarts from 'echarts';

import _ from "lodash";


const { Meta } = Card;
function Home() {
    const barRef = useRef(null);
    const pieRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [pieChart, setPieChart] = useState<Echarts.ECharts | null>(null);
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [AllList, setAllList] = useState([]);
    const token = localStorage.getItem("token");
    // @ts-ignore
    const { username ,region,role:{roleName}} = JSON.parse(token);

    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=60")
        .then((res) => {
            setViewList(res.data);
        });

        axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6")
            .then((res) => {
                setStarList(res.data);
            });

        // 柱状图
        axios.get("/news?publishState=2&_expand=category").then((res) => {
            setAllList(res.data);
            const item = _.groupBy(res.data, (item:HomeState) => item.category.title)
            renderBarView(item);
        });

        return() => {
            window.onresize = null;
        }
    },[]);
    const onClose = () => {
        setVisible(false);
    };
    const renderBarView = (obj:any) => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = Echarts.init(barRef.current);
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: "新闻分类图示",
            },
            tooltip: {},
            legend: {
                data: ["数量"],
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45",
                },
            },
            yAxis: { minInterval: 1 },
            series: [
                {
                    name: "数量",
                    type: "bar",
                    data: Object.values(obj).map((item:any) => item.length),
                },
            ],
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => { //响应式
            myChart.resize();
        };
    };

    const renderPieView = () => {
        let currentList = AllList.filter((data:HomeState) => data.author === username);
        let groupObj = _.groupBy(currentList, (item:HomeState) => item.category.title);

        let list = [];
        for (let i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length,
            });
        }
        var myChart1:any;
        if (!pieChart) {
            myChart1 = Echarts.init(pieRef.current);
            setPieChart(myChart1);
        } else {
            myChart1 = pieChart;
        }


        var option = {
            title: {
                text: "当前用户新闻分类图示",
                left: "center",
            },
            tooltip: {
                trigger: "item",
            },
            legend: {
                orient: "vertical",
                left: "left",
            },
            series: [
                {
                    name: "发布数量",
                    type: "pie",
                    radius: "50%",
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        };

        myChart1.setOption(option);
    };



    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最长浏览" bordered={true}>
                        <List
                            dataSource={viewList}
                            renderItem={(item:HomeState) => (
                                <List.Item>
                                    <a href={`#/news-manage/preview/${item.id}`}>
                                        {item.title}
                                    </a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            dataSource={starList}
                            renderItem={(item:HomeState) => (
                                <List.Item>
                                    <a href={`#/news-manage/preview/${item.id}`}>
                                        {item.title}
                                    </a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting"  onClick={ async ()=>{

                                setVisible(true);

                                if (pieRef.current) {

                                    const myChart1 = Echarts.init(pieRef.current);
                                    setPieChart(myChart1);
                                    await renderPieView();
                                }




                            }}/>,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region?region:"全球"}</b>
                                    <span style={{paddingLeft:"30px"}}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer
                title="个人新闻分类"
                placement="right"
                onClose={onClose}
                open={visible}

            >
                    <div
                        ref={pieRef}
                        style={{border:"1px solid red", marginTop: "30px", width: "100%", height: "400px" }}
                    ></div>
            </Drawer>

            <div
                ref={barRef}
                style={{ marginTop: "30px", width: "100%", height: "400px" }}
            ></div>
        </div>
    );
}

export default Home;





