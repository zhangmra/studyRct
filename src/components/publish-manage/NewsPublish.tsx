import React, {useEffect, useState} from 'react'
import { Space, Table, Tag,Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Category{
    "id": number;
    "title": string;
    "value": string;
}
interface DataType {
    category:Category,
    "categoryId": number,
    "content":string,
    "region":string,
    "author": string,
    "roleId": number,
    "auditState": number,
    "publishState": number,
    "createTime": number,
    "star": number,
    "view": number,
    "id": number,
    "publishTime": number
}
interface ISprops{
    dataSource:DataType[],
    itemBtn:(val:number) => React.ReactNode;
}

function NewsPublish(props:ISprops) {
    const columns: ColumnsType<DataType> = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            align:"center",
            render: (text,item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{text}</a>
            },
        },
        {
            title: '作者',
            dataIndex: 'author',
            align:"center"
        },
        {
            title: '新闻分类 ',
            dataIndex: 'category',
            render:(value, record, index)=>(
                <Space size={[0, 8]} wrap>
                    <Tag color="green">{value.title}</Tag>
                </Space>
            )
        },
        {
            title: '操作',
            key: 'action',
            align:"center",
            render: (value, record) => {
                return <div>{props.itemBtn(record.id)}</div>;
            },
        },
    ];

    return (
        <div>
            <Table rowKey={item=>item.id} columns={columns} dataSource={props.dataSource} pagination={{
                pageSize:5
            }}/>
        </div>
    );
}

export default NewsPublish;

