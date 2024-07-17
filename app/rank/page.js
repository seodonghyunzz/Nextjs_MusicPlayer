'use client'
import { useEffect,useState } from "react";
import usePlayerStore from "../stores/playerStore";


export default function Rank() {

  const PLAYLIST_ID = "37i9dQZEVXbMDoHDwVN2tF";
  const {initializePlayer,setCurrentTrack,player,isMusicPlay,setIsMusicPlay,deviceId,handlePlay,handlePause,access_token, setAccessToken,toptracks, settopTracks,artists, setArtists, isPlayerReady,setIsPlayerReady} = usePlayerStore();

  useEffect(() => {
    const fetchTopTracks = async () => {
      if (!access_token) return;

      const tracksParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      };
      const result = await fetch('https://api.spotify.com/v1/playlists/'+PLAYLIST_ID, tracksParameters)
      const data = await result.json();
      settopTracks(data.tracks.items);
    }
      fetchTopTracks();
  }, [access_token]);
  
  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    setAccessToken(token);
    initializePlayer(token);
  }, [setAccessToken, initializePlayer]);

  const playtrack= (track) => {
    if (!isPlayerReady || !deviceId) return;
    if (isMusicPlay){
    handlePause(deviceId, access_token, isPlayerReady,player);
    setIsMusicPlay(false)
    }else{
      handlePlay(track.uri, deviceId, access_token, isPlayerReady,player);
      setIsMusicPlay(true)
      setCurrentTrack(track)
      
    }
  }
  
    return (
      <div className="newTrack_wrapper">
        <div className="tracktitle">
          <h1>Global Top 50</h1>
          <p className="blank"></p>
        </div>
        <div className="toptrack-list">     
          {toptracks.map(({track},index) => (
            <div key={track.id} className="topTrack">
                <div className="topTrack_card">
                  <p className="rank">{index+1}.</p>
                  <div className="image_container">
              {track.album.images[0]?.url ? (
                <img src={track.album.images[0].url} alt={track.name} width={100} height={100}/>
              ) : (
                <div>No Image Available</div>
              )}
                <div className="button_overlay">
                  {isMusicPlay ? 
                  <button className="play_button" onClick={() => {playtrack(track)}}>II</button>
                  :<button className="play_button" onClick={() => {playtrack(track)}}>▶</button>
                  }
                  </div>
              </div>
                  <div className="trackinfo">
                    <p className="trackname">{track.name}</p>
                    <p className="trackartists">{track.artists.map(artist => artist.name).join(', ')}</p>
                  </div>
                </div>
            </div>
        ))}   
        </div>
      </div>
      
    )
  }