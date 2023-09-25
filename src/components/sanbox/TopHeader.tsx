import React, {useEffect, useState} from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button, theme,Avatar,Dropdown,Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import type { MenuProps } from 'antd';
import { useNavigate } from "react-router-dom";
import {useAppDispatch,useAppSelector} from "../../redux/hooks";
import {setisCollapsed} from "../../redux/reducers/collapsed/CollapsedReducer";
import {shallowEqual} from "react-redux";

function TopHeader(props:any) {
    const {  token: { colorBgContainer } } = theme.useToken();
    const [user, setUser] = useState("admin");
    const navgate = useNavigate();
    const token = localStorage.getItem("token");
    // @ts-ignore
    const { username, role: { roleName } } = JSON.parse(token);

    /*
    * redux
    * */
    const dispatch = useAppDispatch();
    const { isCollapsed } = useAppSelector(state => state.CollapsedReducer,shallowEqual);



    useEffect(()=>{
        setUser(username)
    },[username])
    const onClick: MenuProps['onClick'] = ({ key }) => {
        switch (key){
            case "4":
                localStorage.removeItem("token");
                navgate("/login");
                break;
            default:
                return "";
        }
    };
    const items: MenuProps['items'] = [
        {
            label: `${roleName}`,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '退出',
            danger: true,
            key: '4',
        },
    ];


    // @ts-ignore
    return (
            <Header style={{ padding: 0, background: colorBgContainer }}>
                <Button
                    type="text"
                    icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => {
                        console.log("111",!isCollapsed)
                        dispatch(setisCollapsed({ isCollapsed: !isCollapsed }));
                        // setCollapsed(!collapsed)
                        // props.onclick(!collapsed);
                    }}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <div style={{position:"fixed",right:"30px",top:"0px"}}>
                    <span style={{marginRight:"10px"}}>欢迎 <a>{username}</a> 回来</span>
                    <Dropdown menu={{ items , onClick }} trigger={['click']}>
                        <Avatar style={{ backgroundColor: "#f56a00", verticalAlign: 'middle' }} size="large">
                            {user}
                        </Avatar>
                    </Dropdown>
                </div>

            </Header>
    );
}

export default TopHeader;