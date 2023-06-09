import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Controlled as CodeMirror } from 'react-codemirror2'
import { createPlayground, getPlayground, updatePlayground, deletePlayground } from '../../services/playgroundService'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/css/css'
import 'codemirror/mode/javascript/javascript'

import styles from './Editor.module.css'

export type PlaygroundData = {
  name: string
  html: string
  css: string
  js: string
}

const Editor = () => {
  const navigate = useNavigate();
  const { playgroundId } = useParams();

  const [editorState, setEditorState] = useState<PlaygroundData>({
    name: "",
    html: "",
    css: "",
    js: ""
  })

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [notification, setNotification] = useState({ message: '', type: '' })

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  }

  useEffect(() => {
    if (playgroundId) {
      loadPlayground(playgroundId)
    }
  }, [playgroundId])

  const loadPlayground = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')
      const data = await getPlayground(id, token)
      setEditorState(data)
    } catch (error) {
      console.error(error)
      showNotification('Failed to load the playground.', 'error')
    }
  };

  useEffect(() => {
    runCode()
  }, [editorState])

  const runCode = () => {
    const { html, css, js } = editorState;
    const document = iframeRef.current?.contentDocument
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

  const onEditorChange = (type: 'name' | 'html' | 'css' | 'js', value: string) => {
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
  }

  const { html, css, js } = editorState

  const savePlayground = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      if (playgroundId) {
        await updatePlayground(playgroundId, editorState, token)
        showNotification('Playground saved successfully!', 'success')
      } else {
        const data = await createPlayground(editorState, token)
        navigate(`/editor/${data.id}`)
        showNotification('Playground created successfully!', 'success')
      }
    } catch (error) {
      console.error(error)
      showNotification('Failed to save the playground!', 'error')
    }
  };

  const handleDelete = async (playgroundId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      await deletePlayground(playgroundId, token)
      showNotification('Playground deleted successfully.', 'success')
      navigate('/my-playgrounds')
    } catch (error) {
      console.error(error)
      showNotification('Failed to delete the playground.', 'error')
    }
  }

  const notificationMessage = notification.message ? (
    <div className={`styles.notificationMessage ${styles[notification.type]}`}>
      {notification.message}
    </div>
  ) : null

  return (
    <div className={styles.App}>
      {notificationMessage}
      <div className={styles['playground-header']}>
        <input
          type="text"
          value={editorState.name}
          onChange={(e) => onEditorChange('name', e.target.value)}
          placeholder="Playground Name"
          className={styles['playground-name']}
        />
        <div className={styles['button-group']}>
          <button onClick={savePlayground} className={`${styles['action-button']} ${styles['save-button']} ${styles['margin-right']}`}>Save</button>
          {playgroundId && (
            <button onClick={() => handleDelete(playgroundId)} className={styles['action-button']}>Delete</button>
          )}
        </div>
      </div>
      <section className={styles.playground}>
        <div className={`${styles['code-editor']} ${styles['html-code']}`}>
          <div className={styles['editor-header']}>HTML</div>
          <CodeMirror
            value={html}
            options={{
              mode: "htmlmixed",
              ...codeMirrorOptions
            }}
            onBeforeChange={(editor, data, value) => {
              onEditorChange('html', value)
            }}
          />
        </div>
        <div className={`${styles['code-editor']} ${styles['css-code']}`}>
          <div className={styles['editor-header']}>CSS</div>
          <CodeMirror
            value={css}
            options={{
              mode: "css",
              ...codeMirrorOptions
            }}
            onBeforeChange={(editor, data, value) => {
              onEditorChange('css', value)
            }}
          />
        </div>
        <div className={`${styles['code-editor']} ${styles['js-code']}`}>
          <div className={styles['editor-header']}>JavaScript</div>
          <CodeMirror
            value={js}
            options={{
              mode: "javascript",
              ...codeMirrorOptions
            }}
            onBeforeChange={(editor, data, value) => {
              onEditorChange('js', value)
            }}
          />
        </div>
      </section>
      <section className={styles.result}>
        <iframe title="result" className={styles.iframe} ref={iframeRef} />
      </section>
    </div>
  )
}

export default Editor
