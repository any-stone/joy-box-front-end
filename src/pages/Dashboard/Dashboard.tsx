import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/models';
import styles from './Dashboard.module.css';

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({user}) => {
  const navigate = useNavigate();

  const handleNewPlayground = () => {
    navigate("/editor");
  };

  const handleMyPlaygrounds = () => {
    navigate("/my-playgrounds");
  };

  const handleChangePassword = () => {
    navigate("/auth/change-password");
  };

  return (
    <div className={styles['dashboard-container']}>
      <h1 className={styles['dashboard-header']}>Welcome to your Dashboard, {user?.name}</h1>
      <button className={styles['dashboard-button']} onClick={handleNewPlayground}>New Playground</button>
      <button className={styles['dashboard-button']} onClick={handleMyPlaygrounds}>My Playgrounds</button>
      <button className={styles['dashboard-button']} onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default Dashboard;
