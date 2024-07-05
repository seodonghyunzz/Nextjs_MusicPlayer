'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import usePlayerStore from '../stores/playerStore';

const Callback = () => {
  const router = useRouter();
  const { access_token,setAccessToken } = usePlayerStore();

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.replace('#', '')).get('access_token');
    if (token) {
      setAccessToken(token);
      localStorage.setItem('spotify_token', token);
      router.push('/'); 
    } else {
      console.error('No access token found');
    }
  }, [router, setAccessToken]);

  return (
    <div className='loginloading'>
      <img src="gear.gif" alt="loading" width={100} height={100}></img>
      <p>Processing login...</p>
    </div>
  );
};

export default Callback;