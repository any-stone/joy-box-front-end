import { NavLink } from 'react-router-dom';
import styles from './Landing.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const Landing = () => {
  return (
    <div className={styles.container}>
      <p className={styles.description}>Explore the best playground for your codes.</p>
      <h1 className={styles.title}>THIS IS JOYBOX</h1>
      <NavLink to="/auth/signup">
        <button className={styles.button}>
          Get Started
          <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
        </button>
      </NavLink>
    </div>
  )
}

export default Landing
