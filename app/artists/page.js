'use client'
import { useEffect, useState } from "react";
import usePlayerStore from "../stores/playerStore";
import { useRouter } from "next/navigation";
import MusicPlay from "../musicplay";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const PLAYLIST_ID = "37i9dQZEVXbMDoHDwVN2tF";

export default function Artists() {
  const {currentTrack,isMusicPlay,access_token, setAccessToken,newtracks, setnewTracks,toptracks, settopTracks,artists, setArtists} = usePlayerStore();
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
  useEffect(() => {
    const fetchArtists = async () => {
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
      const uniqueArtistIds = [...new Set(data.tracks.items.flatMap(item => item.track.artists.map(artist => artist.id)))];
      const artistData = await Promise.all(uniqueArtistIds.map(async id => {
        const artistResult = await fetch(`https://api.spotify.com/v1/artists/${id}`, tracksParameters);
        return await artistResult.json();
      }));
      setArtists(artistData);
    };

    fetchArtists();
  }, [access_token]);
  const handleArtistClick = (id) => {
    router.push(`/artist/${id}`)
 }
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
      <div className="newTrack_wrapper">
          <div className="tracktitle">
          <h1>Popular Artists</h1>
          <p className="blank"></p>
        </div>
        <div className="new-track-list">
        {artists.map((artist) => (
              <div key={artist.id} className="topArtist">
                <div className="topArtist_card" onClick={()=>{handleArtistClick(artist.id)}}>
                  {artist.images && artist.images[0]?.url ? (
                    <img src={artist.images[0].url} alt={artist.name} width="200" />
                  ) : (
                    <div>No Image Available</div>
                  )}
                  <p className="artistname">{artist.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div><MusicPlay currentTrack={currentTrack} isMusicPlay={isMusicPlay} playtrack={playtrack_player} onPreviousTrack={handlePreviousTrack} onNextTrack={handleNextTrack} setVolume={setVolume} /></div>
      </div>
    );
  }



  
  
 
  