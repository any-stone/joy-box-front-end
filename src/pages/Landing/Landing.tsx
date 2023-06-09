import { NavLink } from 'react-router-dom'
import styles from './Landing.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const Landing = () => {
  const isLoggedIn = localStorage.getItem('token') !== null
  
  const buttonLabel = isLoggedIn ? 'New Playground' : 'Get Started'
  const targetLink = isLoggedIn ? '/editor' : '/auth/signup'
  
  return (
    <div className={styles.container}>
      <p className={styles.description}>Discover the joy of coding</p>
      <h1 className={styles.title}>THIS IS JOYBOX</h1>
      <NavLink to={targetLink}>
        <button className={styles.button}>
          {buttonLabel}
          <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
        </button>
      </NavLink>
    </div>
  )
}

export default Landing
