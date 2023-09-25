// 自定义 重定向路由
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface ISto{
    to:string
}
export default function Redirct({to}:ISto) {
    const navigate = useNavigate();
    useEffect(()=>{
        navigate(to,{replace:true})
    },[navigate,to])
    return null
}
