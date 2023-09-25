import Redirect from "./Redirct"; // 使用完整的组件导入路径
interface IsAuthComponentProps {
    children: React.ReactNode;
}

/**
 * <></>:空标签包裹实现条件渲染，因为出现了类型不一致的原因报错
 * */
function IsAuthComponent({children}:IsAuthComponentProps):JSX.Element | null{
    console.log(children,'children');
    const isLogin = localStorage.getItem("token");
    if (isLogin) {
        return <>{children}</>;
    } else {
        return <Redirect to="/login" />;
    }
};
export default IsAuthComponent;