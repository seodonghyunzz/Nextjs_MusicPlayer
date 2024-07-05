'use client'
import { useEffect } from 'react';

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = 'streaming user-read-email user-read-private user-library-read user-library-modify';

const Login = () => {
  useEffect(() => {
    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = url;
  }, []);

  return (
    <div className='loginloading'>
      <img src="gear.gif" alt="loading" width={100} height={100}></img>
      <p>Logging in to Spotify...</p>
    </div>
  );
};

export default Login;