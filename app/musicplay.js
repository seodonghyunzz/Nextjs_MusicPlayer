'use client'
import usePlayerStore  from "./stores/playerStore";
export default function MusicPlay(){
    const {currentTrack,isMusicPlay,playtrack_player,onPreviousTrack,onNextTrack} = usePlayerStore();
    return(
        <>
        {currentTrack ?
            <div className="playerWrapper">
                <div className="player">
                    {!currentTrack.album?
                    <div></div>
                    :<img src={currentTrack.album.images[0].url}></img>
                    }
                    <div className="playerBtn">
                            <div className="player_albumdetail">
                                <p className="player_albumdetail1">{currentTrack.name}</p>
                                <p className="player_albumdetail2">{currentTrack.artists.map(artist => artist.name).join(', ')}</p>
                            </div>
                        <div className="player_button">
                            
                            <button className="player_button_BTN"  onClick={onPreviousTrack}>《</button>
                            { !isMusicPlay ?
                            <button className="player_button_BTN" onClick={playtrack_player}>▶</button>
                            :<button className="player_button_BTN" onClick={playtrack_player}>II</button>
                            }
                            <button className="player_button_BTN"  onClick={onNextTrack}>》</button>
                            
                            
                        </div>
                    </div>
                </div>
            </div>
            :<div className="playerWrapper">
            <div className="player">          
                <div className="playerBtn">
                    <div className="player_albumdetail">
                         <p className="player_albumdetail1"></p>
                         <p className="player_albumdetail2"></p>
                    </div>
                    <div className="player_button"> 
                        <button className="player_button_BTN"  >《</button>
                        { !isMusicPlay ?
                        <button className="player_button_BTN" >▶</button>
                        :<button className="player_button_BTN" >II</button>
                        }
                        <button className="player_button_BTN"  >》</button>
                       
                    </div>
                </div>
            </div>
        </div>
            }
        </>
    )
}