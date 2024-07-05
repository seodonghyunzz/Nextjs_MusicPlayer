'use client';

import { useEffect, useState } from "react";
import usePlayerStore from "../stores/playerStore";
import MusicPlay from "../musicplay";
export default function AlbumDetails({id}) {
  const { currentTrackIndex,setCurrentTrackIndex,isMusicPlay,initializePlayer,access_token, setAccessToken, loadAccessToken, currentTrack, setCurrentTrack, handlePlay,handlePause, isPlayerReady, deviceId,setDeviceId,setIsPlayerReady, player,setPlayer,ismusicplay,setIsMusicPlay} = usePlayerStore();
  const [album, setAlbum] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    setAccessToken(token);
    initializePlayer(token);
  }, [setAccessToken, initializePlayer]);
  
  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (!access_token || !id) return;

      const albumParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      };

      const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, albumParameters);
      const data = await response.json();
      setAlbum(data);
    };

    fetchAlbumDetails();
  }, [access_token, id]);

  const playtrack= (track,index) => {
    if (!isPlayerReady || !deviceId) return;
    if (isMusicPlay){
    handlePause(deviceId, access_token, isPlayerReady,player);
    setIsMusicPlay(false)
    }else{
      handlePlay(track.uri, deviceId, access_token, isPlayerReady,player);
      setIsMusicPlay(true)
      setCurrentTrack(track)
      setCurrentTrackIndex(index);
    }
  }
  if (!album) {
    return <div>Loading...</div>; 
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
  
  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % album.tracks.items.length;
    const nextTrack = album.tracks.items[nextIndex];
    playtrack(nextTrack, nextIndex);
  };
  const handlePreviousTrack = () => {
    if (!album || !currentTrackIndex) return;
    const previousIndex = (currentTrackIndex - 1 + album.tracks.items.length) % album.tracks.items.length;
    const previousTrack = album.tracks.items[previousIndex];
    playtrack(previousTrack, previousIndex);
  };
  const setVolume = (volume) => {
    player.setVolume(volume).catch((err) => {
      console.error('Error setting volume:', err);
    });
  };
  
  return (
    <div className="albumDetails">
      <div className="albumDetails_wrapper">
        <div className="albumDetails_info">
          <img src={album.images[0]?.url} alt={album.name} width={250} height={250}/>
          <div>
            <h1>{album.name}</h1>
            <div>
              <h4>{album.release_date}</h4>
              <h4>{album.total_tracks}곡</h4>  
            </div>
          </div>
        </div>
        <div></div>
       
        <div className="albumDetails_track">
            <ul>
            {
              album.tracks.items.map( (track,index) => (
                <li key={track.id}>
                  <div>
                    <p className="albumDetails_track_number"> {track.track_number}</p>
                    <button className="albumDetails_track_playBTN" onClick={()=>{playtrack(track,index)}}>▶</button>
                  </div>
                  <div className="albumDetails_track_info">
                    <h3>{track.name}</h3>
                    <p>{track.artists.map(artist => artist.name).join(', ')}</p>
                  </div>
                </li>
              ))}
            </ul>
        </div>
      
      </div>
      <div><MusicPlay currentTrack={currentTrack} isMusicPlay={isMusicPlay} playtrack={playtrack_player} onPreviousTrack={handlePreviousTrack} onNextTrack={handleNextTrack} setVolume={setVolume} /></div>
    </div>
  );
}
