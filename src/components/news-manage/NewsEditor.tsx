import React, {useEffect, useState} from 'react'
// @ts-ignore
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// @ts-ignore
import { convertToRaw ,ContentState,EditorState} from 'draft-js';
// @ts-ignore
import draftToHtml from 'draftjs-to-html';
// @ts-ignore
import htmlToDraft from 'html-to-draftjs';
interface IPropsEditor{
    getContent(val:any):void,
    content?:string
}

function NewsEditor(props:IPropsEditor) {
    const [editorState,setEnditorState] = useState("");
    const onEditorStateChange =(val:any) =>{
        setEnditorState(val);
    }
    //富文本回显
    useEffect(()=>{
        const html = props.content;
        if (html === undefined) return;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
            );
            const editorState = EditorState.createWithContent(contentState);
            setEnditorState(editorState);
        }
    },[props.content]);
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
                onBlur={()=>{
                    // @ts-ignore
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    );
}

export default NewsEditor;