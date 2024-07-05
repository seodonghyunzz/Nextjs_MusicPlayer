'use client'

import { useState, useEffect } from "react";
import usePlayerStore from "./stores/playerStore";
import { useRouter } from "next/navigation";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const PLAYLIST_ID = "37i9dQZEVXbMDoHDwVN2tF";

export default function Search(){
    const [searchInfo,setsearchInfo] = useState("");
    const [albums,setAlbums] = useState([]);
    const router = useRouter();
    const [showResults, setShowResults] = useState(true);
    const {access_token, setAccessToken} = usePlayerStore();
    useEffect(() => {
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "grant_type=client_credentials&client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET
        }
        fetch('https://accounts.spotify.com/api/token',authParameters)
        .then(result=>result.json())
        .then(data => setAccessToken(data.access_token))
    },[])
    
    async function search() {
        var searchParameters = {
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+ access_token
            }
        }
        var artistID = await fetch('https://api.spotify.com/v1/search?q='+searchInfo+'&type=artist',searchParameters)
        .then(response => response.json())
        .then(data => {
            return(data.artists.items[0].id)
        })
        await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=KR&limit=50', searchParameters)
        .then(response => response.json())
        .then(data => {setAlbums(data.items)})    
    }
    
    const handleAlbumClick = (id) => {
        router.push(`/album/${id}`);
      };
    const toggleResults = () => {
        setShowResults(!showResults);
    };
    const navigateToMain = () => { 
        router.push('/'); 
    };
    return( 
        <>
        <div className="wrapper">
            <div className="search_wrapper"> 
                <img src="/My-playList.svg" width={200} onClick={navigateToMain} ></img>
                <input
                type="input"
                placeholder="search"
                className="searchInput"
                onChange={event=>{setsearchInfo(event.target.value)
                }}
                onKeyDown={event => {
                    if(event.key=="Enter"){
                    search();
                        }
                    }}
                    />
                <button onClick={search} type="button" className="search_btn">search</button>
                {showResults?
                <button onClick={toggleResults} type="button" className="toggle_btn">-</button>
                :<button onClick={toggleResults} type="button" className="toggle_btn">+</button>
                }
                <div className="header_div">
                
                </div>
            </div>
            {showResults && (
             <div className="album_card_wrapper">
                {albums.map((album,_)=>{ 
                    return(
                    <div className="album_card" key={album.id} onClick={()=>handleAlbumClick(album.id)}>
                    
                        <img src={album.images[1].url} width={200}></img>
                         <p className="album_title">{album.name}</p>
                    
                </div>
                )
                })}     
            </div>
              )}
        </div>
        </>
    )
}