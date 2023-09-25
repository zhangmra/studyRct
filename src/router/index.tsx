import React, {useEffect, useState} from 'react'
import {Navigate, useRoutes} from "react-router-dom";
import Home from '../views/sandbox/home/Home';
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import UserList from "../views/sandbox/user-manage/UserList";
import RoleList from "../views/sandbox/right-manage/RoleList";
import RightList from "../views/sandbox/right-manage/RightList";
import IsAuthComponent from '../components/AutoRoute';
import NotFound from '../views/notFound/NotFound';
import NewsAdd from '../views/sandbox/news-manage/NewsAdd';
import NewsDraft from '../views/sandbox/news-manage/NewsDraft';
import NewsCategory from "../views/sandbox/news-manage/NewsCategory";
import NewsAudit from '../views/sandbox/audit-manage/NewsAudit';
import NewsList from '../views/sandbox/audit-manage/NewsList';
import Sunset from '../views/sandbox/publish-manage/Sunset';
import Published from '../views/sandbox/publish-manage/Published';
import Unpublished from '../views/sandbox/publish-manage/Unpublished';
import NewsPreview from '../views/sandbox/news-manage/NewsPreview';
import axios from "axios";
import NewsUpdate from "../views/sandbox/news-manage/NewsUpdate";
import News from '../views/news/News';
import Detaile from "../views/news/Detaile";

const LocalRouterMap:any = {
    "/home":<Home />,
    "/right-manage/role/list":<RoleList />,
    "/right-manage/right/list":<RightList />,
    "/user-manage/list":<UserList />,
    "/news-manage/add":<NewsAdd />,
    "/news-manage/draft":<NewsDraft />,
    "/news-manage/category":<NewsCategory />,
    "/news-manage/preview/:id":<NewsPreview />,
    "/news-manage/update/:id":<NewsUpdate />,
    "/audit-manage/audit":<NewsAudit />,
    "/audit-manage/list":<NewsList />,
    "/publish-manage/unpublished":<Unpublished />,
    "/publish-manage/published":<Published />,
    "/publish-manage/sunset":<Sunset />
}
function IndexRouter() {
    const token: string | null = localStorage.getItem("token");
    let rights: string[] = [];
    if (token) {
        const parsedToken = JSON.parse(token);
        rights = parsedToken?.role?.rights ?? [];
    }

    const [backRouteList,setbackRouteList] = useState<any>([]);
    useEffect(()=>{
        axios.get("http://localhost:5000/rights?_embed=children").then((res) => {
            const formattedRoutes = res.data.map((item:any) => {
                item.path = item.key;
                item.element = LocalRouterMap[item.key];
                item.children.forEach((childItem:any) => {
                    childItem.path = childItem.key;
                    childItem.element = LocalRouterMap[childItem.key];
                });
                return item;
            });
            setbackRouteList([...formattedRoutes]);
        });
    },[]);

    const MyRoutes = useRoutes([
        {
            path: "/login",
            element: <Login />,
        },
        {
            path:"/news",
            element:<News />
        },
        {
            path:"/detaile",
            element:<Detaile />
        },
        {
            path: "/",
            element: (
                <IsAuthComponent>
                    <NewsSandBox />
                </IsAuthComponent>
            ),
            children: [
                {
                    index: true,
                    element: <Navigate to="/home" />,
                },
                ...backRouteList.map((route:any) => {
                    if ((LocalRouterMap[route.key]) && route.pagepermisson !== 1)
                        return <Navigate to="notFound" />
                        const routeConfig:any = {
                            path: route.key,
                            element: LocalRouterMap[route.key],
                        };

                        if (route.children && route.children.length > 0) {
                            routeConfig.children = route.children.map((childRoute:any) => ({
                                path: childRoute.key,
                                element:rights.includes(route.key) ? LocalRouterMap[childRoute.key] : <Navigate to="notFound" />,
                            }));
                        }

                    return routeConfig;

                }),
                {
                    path: "*",
                    element: backRouteList.length > 0 && <NotFound />,
                },
            ],
        },
    ]);
    console.log(MyRoutes,'MyRoutes')
    return MyRoutes;
}



export default IndexRouter;


















// const Myrouters = useRoutes([
//     {
//         path:"/login",
//         element:<Login />
//     },
//     {
//         path:"/",
//         element:
//             <IsAuthComponent>
//                 <NewsSandBox />
//             </IsAuthComponent>,
//             children:[{
//                 path:"",
//                 element:<Navigate to="/home" />
//             },{
//                 path:"home",
//                 element:<Home />
//             },{
//                 path:"right-manage/role/list",
//                 element:<RoleList />
//             },{
//                 path:"right-manage/right/list",
//                 element:<RightList />
//             },{
//                 path:"user-manage/list",
//                 element: <UserList />
//             },{
//                 path:"*",
//                 element: <NotFound />
//             }]
//         },
//
// ])
// console.log(Myrouters,'Myrouters')




// return (Myrouters)








