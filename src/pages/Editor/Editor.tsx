import React, { useState, useEffect, useRef } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { createPlayground } from '../../services/playgroundService'
import Pusher from 'pusher-js'
import pushid from 'pushid'
import axios from 'axios'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/css/css'
import 'codemirror/mode/javascript/javascript'

export type PlaygroundData = {
  html: string
  css: string
  js: string
}

const Editor = () => {
  const [editorState, setEditorState] = useState<PlaygroundData>({
    html: "",
    css: "",
    js: ""
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    runCode()
  }, [editorState])

  const runCode = () => {
    const { html, css, js } = editorState;
    const document = iframeRef.current?.contentDocument;
    const documentContents = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
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
      document.open()
      document.write(documentContents)
      document.close()
    }
  };

  const onEditorChange = (type: 'html' | 'css' | 'js', value: string) => {
    setEditorState(prevState => ({
      ...prevState,
      [type]: value
    }))
  }

  const codeMirrorOptions = {
    theme: 'material',
    lineNumbers: true,
    scrollbarStyle: null,
    lineWrapping: true
  };

  const { html, js, css } = editorState;

  // Save playground to the backend
  const savePlayground = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await createPlayground(editorState, token);
        alert("Playground saved successfully!");
      } else {
        alert("No authentication token found. Please log in first.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save the playground!");
    }
  }

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
        <button onClick={savePlayground}>Save Playground</button>
      </section>
      <section className="result">
        <iframe title="result" className="iframe" ref={iframeRef} />
      </section>
    </div>
  )
}

export default Editor;
