import React, {useEffect, useState} from 'react'
import axios from "axios";
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import UsePublish from "../../../components/publish-manage/UsePublish";
import {Button} from "antd";

function Unpublished() {
    const { dataSource ,handlePublish} = UsePublish(1);
    const handleItemBtnClick = (itemId: number) => {
        return (
            <Button type="primary" onClick={() => handlePublish(itemId)}>
                发布
            </Button>
        );
    };
    return (
        <div>
            <NewsPublish dataSource={dataSource} itemBtn={handleItemBtnClick} />
        </div>
    );
}

export default Unpublished;