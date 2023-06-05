import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAllPlaygrounds } from '../../services/playgroundService'
import { PlaygroundData } from '../Editor/Editor'

type Playground = PlaygroundData & { id: string };

const PlaygroundList: React.FC = () => {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([])
  
  const navigate = useNavigate();

  const isMounted = useRef(true);

  useEffect(() => {
    fetchPlaygrounds();
    return () => {
      isMounted.current = false;
    };
  }, [])

  const fetchPlaygrounds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const data = await getAllPlaygrounds(token);
      
      if (isMounted.current) {
        setPlaygrounds(data);
      }
    } catch (error) {
      console.error(error);
      if (isMounted.current) {
        alert('Failed to fetch playgrounds.');
      }
    }
  };

  const handleEdit = (playgroundId: string) => {
    navigate(`/editor/${playgroundId}`);
  };

  return (
    <div>
      <h1>My Playgrounds</h1>
      {playgrounds.map((playground, index) => (
        <div key={index}>
          <h2>Playground #{index + 1}</h2>
          <p>HTML: {playground.html}</p>
          <p>CSS: {playground.css}</p>
          <p>JS: {playground.js}</p>
          <button onClick={() => handleEdit(playground.id)}>Edit</button>
        </div>
      ))}
    </div>
  )
}

export default PlaygroundList;
