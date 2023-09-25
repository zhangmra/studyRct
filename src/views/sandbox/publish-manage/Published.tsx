import React, {useState} from 'react'
import UsePublish from "../../../components/publish-manage/UsePublish";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import {Button} from "antd";

function Published() {
    const { dataSource ,handleSunset} = UsePublish(2);
    const handleItemBtnClick = (itemId: number) => {
        return (
            <Button type="primary" onClick={() => handleSunset(itemId)}>
                下线
            </Button>
        );
    };
    return (
        <div>
            <NewsPublish dataSource={dataSource} itemBtn={handleItemBtnClick} />
        </div>
    );
}

export default Published;