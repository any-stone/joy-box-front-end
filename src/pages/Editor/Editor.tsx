// ./pages/Editor/Editor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import Pusher from 'pusher-js';
import pushid from 'pushid';
import axios from 'axios';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';

type EditorData = {
  id: string;
  html: string;
  css: string;
  js: string;
};

const Editor = () => {
  const [editorState, setEditorState] = useState<EditorData>({
    id: pushid(),
    html: "",
    css: "",
    js: ""
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const pusher = new Pusher('905a26deb18d94655d2b', {
      cluster: 'us2',
      forceTLS: true
    });
    const channel = pusher.subscribe('editor');

    channel.bind('text-update', (data: EditorData) => {
      if (data.id === editorState.id) return;
      setEditorState({
        id: editorState.id,
        html: data.html || editorState.html,
        css: data.css || editorState.css,
        js: data.js || editorState.js
      });
    });

    return () => {
      pusher.disconnect();
    };
  }, [editorState]);

  useEffect(() => {
    runCode();
  }, [editorState]);

  useEffect(() => {
    syncUpdates();
  }, [editorState]);

  const syncUpdates = () => {
    axios.post('http://localhost:5001/update-editor', editorState)
      .catch(console.error);
  };

  const runCode = () => {
    const { html, css, js } = editorState;
    const document = iframeRef.current?.contentDocument;
    const documentContents = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script type="text/javascript">
          ${js}
        </script>
      </body>
      </html>
    `;

    if (document) {
      document.open();
      document.write(documentContents);
      document.close();
    }
  };

  const onEditorChange = (type: 'html' | 'css' | 'js', value: string) => {
    setEditorState(prevState => ({
      ...prevState,
      [type]: value
    }));
  };

  const codeMirrorOptions = {
    theme: 'material',
    lineNumbers: true,
    scrollbarStyle: null,
    lineWrapping: true
  };

  const { html, js, css } = editorState;

  return (
    <div className="App">
      <section className="playground">
        <div className="code-editor html-code">
          <div className="editor-header">HTML</div>
          <CodeMirror
            value={html}
            options={{
              mode: "htmlmixed",
              ...codeMirrorOptions
            }}
            onBeforeChange={(editor, data, value) => {
              onEditorChange('html', value);
            }}
          />
        </div>
        <div className="code-editor css-code">
          <div className="editor-header">CSS</div>
          <CodeMirror
            value={css}
            options={{
              mode: "css",
              ...codeMirrorOptions
            }}
            onBeforeChange={(editor, data, value) => {
              onEditorChange('css', value);
            }}
          />
        </div>
        <div className="code-editor js-code">
          <div className="editor-header">JS</div>
          <CodeMirror
            value={js}
            options={{
              mode: "javascript",
              ...codeMirrorOptions
            }}
            onBeforeChange={(editor, data, value) => {
              onEditorChange('js', value);
            }}
          />
        </div>
      </section>
      <section className="result">
        <iframe title="result" className="iframe" ref={iframeRef} />
      </section>
    </div>
  );
};

export default Editor;
