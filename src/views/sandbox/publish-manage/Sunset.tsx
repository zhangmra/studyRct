import React, {useState} from 'react'
import UsePublish from "../../../components/publish-manage/UsePublish";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import {Button} from "antd";

function Sunset() {
    const { dataSource ,handleDelete} = UsePublish(3);
    const handleItemBtnClick = (itemId: number) => {
        return (
            <Button type="primary" danger onClick={() => handleDelete(itemId)}>
                删除
            </Button>
        );
    };
    return (
        <div>
            <NewsPublish dataSource={dataSource} itemBtn={handleItemBtnClick} />
        </div>
    );
}

export default Sunset;