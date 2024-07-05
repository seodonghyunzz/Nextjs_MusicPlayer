'use client'
import { useEffect,useState } from "react";
import usePlayerStore from "../stores/playerStore";
import MusicPlay from "../musicplay";


export default function Rank() {
  
  const CLIENT_ID = "04fc8d88edef4baf8db9534c9460bfe1";
  const CLIENT_SECRET = "c61b8259011e4fff8c86a79d1a831732";
  const PLAYLIST_ID = "37i9dQZEVXbMDoHDwVN2tF";
  const {currentTrack, setCurrentTrack,initializePlayer,setCurrentTrackPosition,player,isMusicPlay,setIsMusicPlay,deviceId,handlePlay,handlePause,access_token, setAccessToken,toptracks, settopTracks,artists, setArtists, isPlayerReady,setIsPlayerReady} = usePlayerStore();

 
 
  // useEffect(() => {
  //   const getAuth = async () => {
  //     const authParameters = {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       },
  //       body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
  //     };

  //     const result = await fetch('https://accounts.spotify.com/api/token', authParameters);
  //     const data = await result.json();
  //     setAccessToken(data.access_token);
  //   };
  //   getAuth();
  // }, []);
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
  const playtrack_player = () => {
    if (!currentTrack) return;
    if (isMusicPlay) {
      handlePause(deviceId, access_token, isPlayerReady, player);
      setIsMusicPlay(false);
    } else {
      handlePlay(currentTrack.uri, deviceId, access_token, isPlayerReady, player);
      setIsMusicPlay(true);
      
    }
  };
  const onNextTrack = () => {
    if (!currentTrack || !toptracks.length) return;
    setCurrentTrackPosition(0);
    const currentIndex = toptracks.findIndex(({ track }) => track.uri === currentTrack.uri);
    const nextTrack = toptracks[(currentIndex + 1) % toptracks.length].track;
    playtrack(nextTrack);
  };

  const onPreviousTrack = () => {
    setCurrentTrackPosition(0);
    if (!currentTrack || !toptracks.length) return;
    const currentIndex = toptracks.findIndex(({ track }) => track.uri === currentTrack.uri);
    const previousTrack = toptracks[(currentIndex - 1 + toptracks.length) % toptracks.length].track;
    playtrack(previousTrack);
  };
  const setVolume = (volume) => {
    player.setVolume(volume).catch((err) => {
      console.error('Error setting volume:', err);
    });
  };
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
        <div><MusicPlay currentTrack={currentTrack} isMusicPlay={isMusicPlay} playtrack={playtrack_player} onPreviousTrack={onPreviousTrack} onNextTrack={onNextTrack} setVolume={setVolume} /></div>
      </div>
      
    )
  }