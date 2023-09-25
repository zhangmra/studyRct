import React, {useCallback, useState, useEffect } from 'react'
import { LockOutlined, UserOutlined,EyeInvisibleOutlined,EyeTwoTone } from '@ant-design/icons';
import type { Container, Engine } from "tsparticles-engine";
import particlesOptions from "../../static/particles.json";
import {Button, Form, Input, message, Col, Row} from 'antd';
import { ISourceOptions } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import {useNavigate} from "react-router-dom";
import Particles from "react-tsparticles";
import axios from "axios";
import "./Login.css";


const Login:React.FC = () => {
    const navgite = useNavigate();
    const particlesInit = useCallback(async (engine: Engine) => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log(container);
    }, []);

    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});

    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const onFinish = (values: any) => {
        console.log('Finish:', values);
        axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=${true}&_expand=role`).then((res)=>{

            if (res.data.length === 0){
                message.error("登录名或密码不匹配")
            }else {
                localStorage.setItem("token",JSON.stringify(res.data[0]));
                navgite("/");
            }
        }).catch((err)=>{
            console.log(err,'err')
        })
    };
    return (
        <div>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
               options={particlesOptions as ISourceOptions}
            />
            <div className="login">
                <div><h1>全球新闻发布系统</h1></div>
                <Row>
                    <Col span={24} >
                        <Form
                              initialValues={{ remember: true }} form={form} name="horizontal_login" layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: '请输入用户名!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '请输入密码！' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="密码"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Form.Item shouldUpdate>
                                {() => (
                                    <Button
                                        style={{width:"100%"}}
                                        type="primary"
                                        htmlType="submit"
                                        disabled={
                                            !form.isFieldsTouched(true) ||
                                            !!form.getFieldsError().filter(({ errors }) => errors.length).length
                                        }
                                    >
                                        登录
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>

        </div>
    );
}

export default Login;


// xs：Extra Small，用于超小屏幕，比如手机竖屏模式。
// sm：Small，用于小屏幕，比如手机横屏模式。
// md：Medium，用于中等屏幕，比如平板电脑。
// lg：Large，用于大屏幕，比如桌面显示器。
// xl：Extra Large，用于超大屏幕，比如大尺寸的桌面显示器。

