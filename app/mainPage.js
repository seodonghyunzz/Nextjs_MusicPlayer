'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePlayerStore from "./stores/playerStore";
import MusicPlay from "./musicplay";

const PLAYLIST_ID = "37i9dQZEVXbMDoHDwVN2tF";


export default function Mainpage() {
  const {access_token,setAccessToken,isPlayerInitialized,setIsPlayerInitialized,currentTrack, setCurrentTrack,initializePlayer,setCurrentTrackPosition,player,isMusicPlay,setIsMusicPlay,deviceId,handlePlay,handlePause,newtracks, setnewTracks,toptracks, settopTracks,artists, setArtists, isPlayerReady,setIsPlayerReady} = usePlayerStore();
  const router = useRouter();

  useEffect(() => {
    if (!access_token) {
      router.push('/login');
    }
  }, [access_token, router]);

  useEffect(() => {
    const fetchNewTracks = async () => {
      if (!access_token) return;

      const tracksParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      };

      const result = await fetch('https://api.spotify.com/v1/browse/new-releases?country=KR&limit=5', tracksParameters);
      const data = await result.json();
      await setnewTracks(data.albums.items); 
      
    };
    fetchNewTracks();

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
      settopTracks(data.tracks.items.slice(0,10));
    

      const uniqueArtistIds = [...new Set(data.tracks.items.flatMap(item => item.track.artists.map(artist => artist.id)))];
      const artistData = await Promise.all(uniqueArtistIds.map(async id => {
        const artistResult = await fetch(`https://api.spotify.com/v1/artists/${id}`, tracksParameters);
        return await artistResult.json();
      }));
      setArtists(artistData.slice(0,5));
    };

    fetchNewTracks();
    fetchTopTracks();
  }, [access_token]);



  useEffect(() => {
    if (!isPlayerInitialized) {
      const token = access_token;
      
      initializePlayer(token);
    }
  }, [isPlayerInitialized, setAccessToken, initializePlayer, setIsPlayerInitialized]);


  const navigateToRank = () => {
      router.push('/rank');
  };
 
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
  const handleAlbumClick = (id) => {
    router.push(`/album/${id}`);
  };
 const handleArtistClick = (id) => {
    router.push(`/artist/${id}`)
 }
  if(!access_token){
    return(
      <div className="loading">
        <img src="gear.gif" alt="loading" width={100} height={100}></img>
        <p>Loading</p>
      </div>
    )
  }
  
  return (
    <>
    <div className="newTrack_wrapper">
      <div className="tracktitle">
        <h1>Top tracks</h1>
        <p className="blank"></p>
        <p className="seemore"><a onClick={navigateToRank}>전체보기</a></p>
      </div>
      <div className="toptrack-list">     
      {toptracks.map(({track},index) => (
          <div key={track.id} className="topTrack">
            <div className="topTrack_card">
              <p className="rank">#{index+1}</p>
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
      <div className="tracktitle">
        <h1>New releases</h1>
        <p className="blank"></p>
        <p className="seemore"><a href="/newreleases">전체보기</a></p>
      </div>
      <div className="track-list">
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
      <div className="tracktitle">
        <h1>Popular Artists</h1>
        <p className="blank"></p>
        <p className="seemore"><a href="/artists">전체보기</a></p>
      </div>
      <div className="track-list">
      {artists.map((artist) => (
            <div key={artist.id} className="topArtist">
              <div className="topArtist_card" onClick={()=>{handleArtistClick(artist.id)}}>
                {artist.images && artist.images[0]?.url ? (
                  <img src={artist.images[0].url} alt={artist.name} width="200" />
                ) : (
                  <div>No Image</div>
                )}
                <p className="artistname">{artist.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div><MusicPlay currentTrack={currentTrack} isMusicPlay={isMusicPlay} playtrack={playtrack_player} onPreviousTrack={onPreviousTrack} onNextTrack={onNextTrack} setVolume={setVolume} /></div>
    </>
  );
}