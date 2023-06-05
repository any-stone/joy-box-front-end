import React, { useEffect, useState, useRef } from 'react'
import { getAllPlaygrounds } from '../../services/playgroundService'
import { PlaygroundData } from '../Editor/Editor' 

const PlaygroundList: React.FC = () => {
  const [playgrounds, setPlaygrounds] = useState<PlaygroundData[]>([])
  
  // Create a ref to track if the component is still mounted
  const isMounted = useRef(true);

  useEffect(() => {
    fetchPlaygrounds();

    // When the component is unmounted, we change the isMounted.current to false
    return () => {
      isMounted.current = false;
    };
  }, [])

  const fetchPlaygrounds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const data = await getAllPlaygrounds(token);
      
      // Only call setPlaygrounds if the component is still mounted
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
