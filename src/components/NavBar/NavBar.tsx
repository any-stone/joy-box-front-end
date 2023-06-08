// npm modules
import { NavLink } from 'react-router-dom'

// types
import { User } from '../../types/models'

import styles from './NavBar.module.css';

interface NavBarProps {
  user: User | null;
  handleLogout: () => void;
}

const NavBar = (props: NavBarProps): JSX.Element => {
  const { user, handleLogout } = props;

  return (
    <nav className={styles.nav}>
      <NavLink className={styles.navLinkBrand} to="/">JOYBOX</NavLink>
      {user ?
        <ul className={styles.navList}>
          <li className={styles.navItem}><NavLink className={styles.navLink} to="/dashboard">My Dashboard</NavLink></li>
          <li className={styles.navItem}><NavLink className={styles.navLink} to="" onClick={handleLogout}>Log out</NavLink></li>
        </ul>
        :
        <ul className={styles.navList}>
          <li className={styles.navItem}><NavLink className={styles.navLink} to="/auth/login">Log In</NavLink></li>
          <li className={styles.navItem}><NavLink className={styles.navLink} to="/auth/signup">Sign Up</NavLink></li>
        </ul>
      }
    </nav>
  )
}

export default NavBar
