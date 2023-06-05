import React, { useEffect, useState } from 'react'
import { getAllPlaygrounds } from '../../services/playgroundService'
import { PlaygroundData } from '../Editor/Editor' 

const PlaygroundList: React.FC = () => {
  const [playgrounds, setPlaygrounds] = useState<PlaygroundData[]>([])

  useEffect(() => {
    fetchPlaygrounds()
  }, [])

  const fetchPlaygrounds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const data = await getAllPlaygrounds(token);
      setPlaygrounds(data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch playgrounds.');
    }
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
        </div>
      ))}
    </div>
  )
}

export default PlaygroundList
