import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getAllPlaygrounds, deletePlayground } from '../../services/playgroundService'
import { PlaygroundData } from '../Editor/Editor'

import styles from './PlaygroundList.module.css'

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

  return (
    <div className={styles.playgroundsContainer}>
      <h1>My Playgrounds</h1>
      <div className={styles.playgroundCardsContainer}>
        {playgrounds.map((playground) => (
          <Link to={`/editor/${playground.id}`} key={playground.id}>
            <div className={styles.playgroundCard}>
              <div className={styles.playgroundName}>{playground.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PlaygroundList;
