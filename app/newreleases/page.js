'use client'

import { useEffect, useState } from "react";
import usePlayerStore from "../stores/playerStore";
import { useRouter } from "next/navigation";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;

export default function Newreleases() {
  const {access_token, setAccessToken,newtracks, setnewTracks} = usePlayerStore();
  const router = useRouter();
  useEffect(() => {
    const getAuth = async () => {
      const authParameters = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
      };

      const result = await fetch('https://accounts.spotify.com/api/token', authParameters);
      const data = await result.json();
      setAccessToken(data.access_token);
    };
    getAuth();
  }, []);
  useEffect(()=>{
      const fetchNewTracks = async () => {
        if (!access_token) return;
  
        const tracksParameters = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
          }
        };
  
        const result = await fetch('https://api.spotify.com/v1/browse/new-releases?country=KR&limit=30', tracksParameters);
        const data = await result.json();
        setnewTracks(data.albums.items); 
        
      };
      fetchNewTracks();
  },[access_token])
  const handleAlbumClick = (id) => {
    router.push(`/album/${id}`);
  };
    return (
      <>
        <div className="newTrack_wrapper">
            <div className="tracktitle">
            <h1>New releases</h1>
            <p className="blank"></p>
          </div>
          <div className="new-track-list">
            {newtracks.map((track) => (
              <div key={track.id} className="newTrack">
                 <div className="newTrack_card" onClick={() => handleAlbumClick(track.id)}>
                  <img src={track.images[0]?.url} alt={track.name} width="200" />
                  <p className="trackname">{track.name}</p>
                  <p className="trackartists">{track.artists.map(artist => artist.name).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }