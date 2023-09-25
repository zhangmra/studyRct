import React, {useEffect, useState,createElement} from 'react';
import "./index.scss";
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {useNavigate,useLocation} from "react-router-dom";
import axios from "axios";
import * as Icons from '@ant-design/icons';
import {useAppSelector} from "../../redux/hooks";
import {shallowEqual} from "react-redux";


const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

//定义接口数据类型
declare namespace Menu {
    interface MenuOptions {
        grade?:number,
        icon?: string;
        id?:number;
        key?:string;
        pagepermisson?:number
        title?:string;
        children?: MenuOptions[];
    }
}

// @ts-ignore
function getItem({label, key,icon,children,type,pagepermisson}: {
    children?: MenuItem[] | any,
    icon?: React.ReactNode,
    key?:any,
    label: React.ReactNode,
    pagepermisson?: number,
    type?: any
}): MenuItem { // @ts-ignore
    return { key,icon,children,label,type,pagepermisson } }




// 动态渲染 Icon 图标
const customIcons: { [key: string]: any } = Icons;
//添加图标
const addIcon = (name: string) => {
    return name ? createElement(customIcons[name]) : '';
};

function SideMenu() {
    const navigate = useNavigate(); //路由跳转
    //获取redux存储的值 shallowEqual：shallowEqual-在组件决定是否被渲染之前,会进行一次浅比较如果该组件依赖的state并没有被更改,不进行渲染
    const isCollapsed = useAppSelector(state => state.CollapsedReducer,shallowEqual);

    const [menu,setMenu] = useState<MenuItem[]>([]);
    const location = useLocation(); //获取当前路由信息
    const openKey     = "/" + location.pathname.split("/")[1]
    const selectedKey = location.pathname;
    const token = localStorage.getItem("token");
    // @ts-ignore
    const { role: { rights } } = JSON.parse(token);

    //过滤子项pagepermisson = 1的路由信息
    const checkpage = (items: MenuItem[]) =>{
        return items.filter((val:any) => val.pagepermisson && rights.includes(val.key));
    }
    // 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
    const deepLoopFloat = (menuList: Menu.MenuOptions[], newArr: MenuItem[] = []) => {
        // 获取菜单列表并处理成 antd menu 需要的格式
        menuList.forEach((item:Menu.MenuOptions)=>{
            if (!item?.children?.length) {
                if (item.pagepermisson === 1 && rights.includes(item.key))
                   return newArr.push(getItem({
                        label: item.title,
                        key: item.key,
                        icon: addIcon(item.icon!),
                        pagepermisson: item.pagepermisson
                    }));
            }

            if(item.pagepermisson === 1 && rights.includes(item.key)){
                console.log(item,'items')
                newArr.push(getItem({
                    label:item.title,
                    key:item.key,
                    icon: addIcon(item.icon!),
                    children: checkpage(deepLoopFloat(item.children ? item.children : [])),
                    pagepermisson:item.pagepermisson
                }));
            }
            // console.log(newArr,'newarr')
        });
        return newArr;
    }

    useEffect(()=>{
        axios.get("http://localhost:5000/rights?_embed=children").then((res:any)=>{
            console.log(res.data,"p")
            setMenu(deepLoopFloat(res.data));
        })
    },[]);


    const handleMenuClick = (e:any) => {
        const path = e.key; // 获取菜单项的路径
        if (path) {
            navigate(path); // 使用 useNavigate 进行导航
        }
    };
    return (
        <Sider trigger={null} collapsible collapsed={isCollapsed.isCollapsed}>
            <div style={{display:"flex",height:"100%",flexDirection:"column"}}>
                <div className="logo">新闻系统</div>
                <div style={{flex:1,overflow:"auto"}}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        defaultOpenKeys={[openKey]}
                        items={menu}
                        onClick={(e)=>{ handleMenuClick(e) }}
                    />
                </div>
            </div>
        </Sider>
    );
}

export default SideMenu;
