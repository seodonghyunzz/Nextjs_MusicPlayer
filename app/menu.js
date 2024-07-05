'use client'
import { useRouter } from "next/navigation";
import usePlayerStore from "./stores/playerStore";

export default function Menu(){
    const router = useRouter();
    const { player } = usePlayerStore();

    const navigateToRank = () => {
        
          router.push('/rank');
        
      };
      const navigateToMain = () => {
       
          router.push('/');
        
      };
      const navigateToNewReleases = () => {
        router.push('/newreleases');
      };
    
      const navigateToArtists = () => {
        router.push('/artists');
      };
      
    return(
        <div className="header_wrapper">
            <ul>
                <li><a onClick={navigateToMain}>main</a></li>
                <li><a onClick={navigateToRank}>rank</a></li>
                <li><a onClick={navigateToNewReleases}>new releases</a></li>
                <li><a onClick={navigateToArtists}>artists</a></li>
            </ul>
        </div>
    )
}