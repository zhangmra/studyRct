/**
 * 路由懒加载封装
 */
import React, { ReactElement, LazyExoticComponent } from 'react';
type LazyLoadFunction = (path: string) => ReactElement;

const lazyLoad: LazyLoadFunction =(path)=>{
    // const Comp = React.lazy(()=> import(`../views/${path}`));
    const Comp: LazyExoticComponent<any> = React.lazy(() => import(`../views/${path}`));
    return (
        <React.Suspense fallback={<>加载中。。。</>}>
            <Comp/>
        </React.Suspense>
    )
}