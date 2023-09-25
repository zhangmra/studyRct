import React, {useState} from 'react'

interface ISprops{
    animationDuration: number,
    isFinished: boolean,
    children: React.ReactNode;
}
function Container({animationDuration,children,isFinished}:ISprops){
    return (
        <div
            style={{
                opacity: isFinished ? 0 : 1,
                pointerEvents: 'none',
                transition: `opacity ${animationDuration}ms linear`,
            }}
        >
            {children}
        </div>
    );
}

export default Container;