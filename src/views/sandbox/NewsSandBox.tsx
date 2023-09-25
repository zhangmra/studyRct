import React, {useEffect, useState} from 'react'
import SideMenu from "../../components/sanbox/SideMenu";
import TopHeader from "../../components/sanbox/TopHeader";
import {Outlet, useLocation} from "react-router-dom";
import { useNProgress } from '@tanem/react-nprogress'
import { Layout, Space, Spin, theme } from 'antd';
import "./NewsSandBoxcss.scss";
import Container from './Container';
import Bar from './Bar';
import {shallowEqual, useSelector} from "react-redux";
import {useAppSelector} from "../../redux/hooks";

const { Content } = Layout;

function NewsSandBox() {
    const { token: { colorBgContainer } } = theme.useToken();
    const { isLoading } = useAppSelector(state => state.LoadingReducer,shallowEqual);

    const [collapsed,setcollapsed] = useState(false);
    const [isLoadings, setIsLoading] = useState(false);
    const location = useLocation(); //获取路由信息
    console.log(location,'opop')
    setTimeout(()=>{
        setIsLoading(true);
    },200)


    useEffect(()=>{
        setTimeout(()=>{
            setIsLoading(false);
        },400)
    },[location.pathname]);

    return (
           <Layout>
               <Progress isAnimating={isLoadings} key={location.key} />
               {/*<SideMenu isCollapsed={collapsed}></SideMenu>*/}
               <SideMenu />
               <Layout>
                   <TopHeader onclick={(e:boolean)=>{ setcollapsed(e) }}></TopHeader>
                   <Content
                       style={{
                           margin: '24px 16px',
                           padding: 24,
                           minHeight: 280,
                           background: colorBgContainer,
                           overflow:"auto"
                       }}>
                       <Space direction="vertical" style={{ width: '100%' }}>
                           <Spin spinning={isLoading} tip="Loading...">
                                <Outlet></Outlet>
                           </Spin>
                       </Space>
                   </Content>
               </Layout>
           </Layout>
    );
}
const Progress: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
    const { animationDuration, isFinished, progress } = useNProgress({
        isAnimating,
    })
    return (
        <Container animationDuration={animationDuration} isFinished={isFinished}>
            <Bar animationDuration={animationDuration} progress={progress} />
        </Container>
    )
}
export default NewsSandBox;