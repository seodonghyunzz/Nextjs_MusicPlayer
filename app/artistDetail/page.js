'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import usePlayerStore from "../stores/playerStore";
import MusicPlay from "../musicplay";
export default function ArtistDetail({id}) {
  const { currentTrackIndex,setCurrentTrackIndex,isMusicPlay,initializePlayer,access_token, setAccessToken, loadAccessToken, currentTrack, setCurrentTrack, handlePlay,handlePause, isPlayerReady, deviceId,setDeviceId,setIsPlayerReady, player,setPlayer,ismusicplay,setIsMusicPlay} = usePlayerStore();
  const [artist, setArtist] = useState(null);
  const [artistAlbum , setArtistAlbum] = useState([])
  const router = useRouter();
  
  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (!access_token || !id) return;

      const artistParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      };

      const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, artistParameters);
      const data = await response.json();
      setArtist(data);
      
      const artist_response = await fetch('https://api.spotify.com/v1/artists/' + id + '/albums' , artistParameters)
      const artistData = await artist_response.json();
      setArtistAlbum(artistData.items);
     
        
    };

    fetchAlbumDetails();
  }, [access_token, id]);

  const handleAlbumClick = (id) => {
    router.push(`/album/${id}`);
  };
  const formatFollowers = (followers) => {
    if (followers >= 1000000) {
      return (followers / 1000000).toFixed(1) + 'm';
    } else if (followers >= 1000) {
      return (followers / 1000).toFixed(1) + 'k';
    }
    return followers;
  };
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
    if (!artist) return(
        <div className="loading">
          
          <p>Loading..</p>
        </div>
      )
  return (
    <>
    <div className="albumDetails">
      <div className="albumDetails_wrapper">
         <div className="albumDetails_info">
            <img src={artist.images[0]?.url} alt={artist.name} width={250} height={250} />
                <div className="artistDetail_info">
                <h1>{artist.name}</h1>
                <h4>Followers: {formatFollowers(artist.followers.total)}</h4>
                <h4>Genre: {artist.genres.join(', ')}</h4>
                </div>
        </div>
      </div>
      <div className="albumDetails_track">
        <ul>
          {artistAlbum.map(album => (
            <li key={album.id} onClick={() => handleAlbumClick(album.id)} >
              <img src={album.images[0]?.url} alt={album.name} width={100} height={100} />
              <div  >
                <h3>{album.name}</h3>
                <h4>{album.release_date}</h4>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div><MusicPlay currentTrack={currentTrack} isMusicPlay={isMusicPlay} playtrack={playtrack_player} onPreviousTrack={handlePreviousTrack} onNextTrack={handleNextTrack} setVolume={setVolume} /></div>
    </div>
    </>
  );
}
  



