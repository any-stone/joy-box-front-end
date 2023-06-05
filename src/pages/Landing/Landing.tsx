// css
import styles from './Landing.module.css'

// types
import { User } from '../../types/models'

interface LandingProps {
  user: User | null;
}

const Landing = (props: LandingProps): JSX.Element => {
  const { user } = props

  return (
    <main className={styles.container}>
      <h1>hello, {user ? user.name : 'friend'}</h1>
      <p>Welcome to JoyBox, your favorite JavaScript playground</p>
      <p>Please login to start </p>
    </main>
  )
}

export default Landing
