import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNewPlayground = () => {
    navigate("/editor");
  };

  const handleMyPlaygrounds = () => {
    navigate("/my-playgrounds");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleNewPlayground}>New Playground</button>
      <button onClick={handleMyPlaygrounds}>My Playgrounds</button>
    </div>
  );
};

export default Dashboard;
