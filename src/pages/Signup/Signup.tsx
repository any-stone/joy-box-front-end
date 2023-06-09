// npm modules
import { useState, useRef } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'

// services
import * as authService from '../../services/authService'

// css
import styles from './Signup.module.css'

// types
import { SignupFormData, PhotoFormData } from '../../types/forms'
import { handleErrMsg } from '../../types/validators'
import { AuthPageProps } from '../../types/props'

const Signup = (props: AuthPageProps): JSX.Element => {
  const { handleAuthEvt } = props
  const navigate = useNavigate()
  const imgInputRef = useRef<HTMLInputElement | null>(null)

  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    passwordConf: '',
  })
  const [photoData, setPhotoData] = useState<PhotoFormData>({
    photo: null
  })

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('')
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }

  const handleChangePhoto = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) return
    const file = evt.target.files[0]
    let isFileInvalid = false
    let errMsg = ""
    const validFormats = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'webp']
    const photoFormat = file.name.split('.').at(-1)

    // cloudinary supports files up to 10.4MB each as of May 2023
    if (file.size >= 10485760) {
      errMsg = "Image must be smaller than 10.4MB"
      isFileInvalid = true
    }
    if (photoFormat && !validFormats.includes(photoFormat)) {
      errMsg = "Image must be in gif, jpeg/jpg, png, svg, or webp format"
      isFileInvalid = true
    }

    setMessage(errMsg)

    if (isFileInvalid && imgInputRef.current) {
      imgInputRef.current.value = ""
      return
    }

    setPhotoData({ photo: evt.target.files[0] })
  }

  const { name, email, password, passwordConf } = formData

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      setIsSubmitted(true)
      await authService.signup(formData, photoData)
      handleAuthEvt()
      navigate('/')
    } catch (err) {
      console.log(err)
      handleErrMsg(err, setMessage)
      setIsSubmitted(false)
    }
  }

  const isFormInvalid = () => {
    return !(name && email && password && password === passwordConf)
  }

  return (
    <main className={styles.container}>
      <h1>Sign Up</h1>
      <p className={styles.message}>{message}</p>
      <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Name
          <input
            className={styles.inputField}
            type="text"
            value={name}
            name="name"
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Email
          <input
            className={styles.inputField}
            type="text"
            value={email}
            name="email"
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Password
          <input
            className={styles.inputField}
            type="password"
            value={password}
            name="password"
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Confirm Password
          <input
            className={styles.inputField}
            type="password"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
          />
        </label>
        <label className={styles.fileLabel}>
          Upload Photo
          <div className={styles.fileInputContainer}>
            <input
              className={styles.fileInput}
              type="file"
              name="photo"
              onChange={handleChangePhoto}
              ref={imgInputRef}
            />
          </div>
        </label>
        <div>
          <button
            className={styles.signupButton}
            disabled={isFormInvalid() || isSubmitted}
          >
            {!isSubmitted ? 'Sign Up' : '🚀 Sending...'}
          </button>
        </div>
      </form>
      <div className={styles.signInMessage}>
        <span>Already have an account? </span>
        <NavLink to="/auth/login">Sign In</NavLink>
      </div>
    </main>
  )
}

export default Signup
