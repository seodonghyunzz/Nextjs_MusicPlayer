'use client'
import { useEffect, useState } from "react";
import usePlayerStore from "../stores/playerStore";
import { useRouter } from "next/navigation";
import MusicPlay from "../musicplay";

const PLAYLIST_ID = "37i9dQZEVXbMDoHDwVN2tF";

export default function Artists() {
  const {onNextTrack,onPreviousTrack,playtrack_player,currentTrack,isMusicPlay,access_token, setAccessToken,newtracks, setnewTracks,toptracks, settopTracks,artists, setArtists} = usePlayerStore();
  const router = useRouter();
  
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
        <div><MusicPlay currentTrack={currentTrack} isMusicPlay={isMusicPlay} playtrack={playtrack_player} onPreviousTrack={onPreviousTrack} onNextTrack={onNextTrack} /></div>
      </div>
    );
  }



  
  
 
  