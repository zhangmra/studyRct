import React, {useContext, useEffect, useRef, useState} from 'react'

import {Space, Table, Tag, Button, Modal, Form, Input} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FormInstance } from 'antd/es/form';
import type { InputRef } from 'antd';
import {DeleteOutlined,ExclamationCircleFilled} from '@ant-design/icons';
import axios from "axios";
const { confirm } = Modal;

interface DataType {
    title: string,
    id: number,
    value:string
}

function NewsCategory() {
    const [datas,setdatas] = useState<DataType[]>([]);
    const EditableContext = React.createContext<FormInstance<any> | null>(null);
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            align:"center",
            render: (text) => <a>{text}</a>,
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: "title",
                title: "栏目名称",
                handleSave: handleSave,
            })
        },
        {
            title: '操作',
            key: 'action',
            align:"center",
            render: (value, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>{ showConfirm(value) }} shape="circle" danger icon={<DeleteOutlined />} />

                </Space>
            ),
        },
    ];
    const handleSave = (record:DataType) => {
        axios
            .patch(`/categories/${record.id}`, { title: record.title })
            .then((res) => {
                setdatas(
                    datas.map((data) => {
                        if (data.id === res.data.id) {
                            return res.data;
                        }
                        return data;
                    })
                );
            });
    };
    useEffect(()=>{
        axios.get("/categories").then((res)=>{
            const list = res.data;
            setdatas(list);
        })
    },[]);
    const del= (item:any) =>{
        console.log(item,'item')
        let oneData =  datas.filter((val) => val.id === item.rightId);
        oneData = oneData.filter((data)=>data.id !== item.id);
        axios.delete(`/children/${item.id}`);
        setdatas([...datas,...oneData]);
    }
    const showConfirm = (value:Object) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '您确定要删除当前数据？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                del(value)
            }
        });
    };
    interface EditableRowProps {
        index: number;
    }
    const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    interface EditableCellProps {
        title: React.ReactNode;
        editable: boolean;
        children: React.ReactNode;
        dataIndex: keyof DataType;
        record: DataType;
        handleSave: (record: DataType) => void;
    }

    const EditableCell: React.FC<EditableCellProps> = ({
                                                           title,
                                                           editable,
                                                           children,
                                                           dataIndex,
                                                           record,
                                                           handleSave,
                                                           ...restProps
                                                       }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef<InputRef>(null);
        const form = useContext(EditableContext)!;

        useEffect(() => {
            if (editing) {
                inputRef.current!.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({ [dataIndex]: record[dataIndex] });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();

                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    return (
        <div>
            <Table components={components} rowKey={item=>item.id} columns={columns} dataSource={datas} pagination={{
                pageSize:5
            }}/>
        </div>
    );
}

export default NewsCategory;

