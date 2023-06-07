import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/models';

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
    <div>
      <h1>Welcome to your Dashboard, {user?.name}</h1>
      <button onClick={handleNewPlayground}>New Playground</button>
      <button onClick={handleMyPlaygrounds}>My Playgrounds</button>
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default Dashboard;
