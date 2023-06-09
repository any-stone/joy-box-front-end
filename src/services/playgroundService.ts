import axios from 'axios'

export const createPlayground = async (playgroundData: any, token: string) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }

  const res = await axios.post('http://joybox-new.fly.dev/api/playgrounds', playgroundData, config)
  return res.data
}

export const getAllPlaygrounds = async (token: string) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }

  const res = await axios.get('http://joybox-new.fly.dev/api/playgrounds', config)
  return res.data
}

export const getPlayground = async (playgroundId: string, token: string) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }

  const res = await axios.get(`http://joybox-new.fly.dev/api/playgrounds/${playgroundId}`, config)
  return res.data
}

export const updatePlayground = async (playgroundId: string, updatedPlayground: any, token: string) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }

  const res = await axios.put(`http://joybox-new.fly.dev/api/playgrounds/${playgroundId}`, updatedPlayground, config)
  return res.data
}

export const deletePlayground = async (playgroundId: string, token: string) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }

  const res = await axios.delete(`http://joybox-new.fly.dev/api/playgrounds/${playgroundId}`, config)
  return res.data
}

