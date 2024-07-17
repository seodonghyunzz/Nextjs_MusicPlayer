import { create } from "zustand";

const usePlayerStore = create((set, get) => ({
  access_token: null,
  setAccessToken: (token) => {
    localStorage.setItem('spotify_access_token', token);
    set({ access_token: token });
  },
  loadAccessToken: () => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      set({ access_token: token });
    }
  },
  newtracks: [],
  setnewTracks: (tracks) => set({ newtracks: tracks }),
  toptracks: [],
  settopTracks: (tracks) => set({ toptracks: tracks }),
  artists: [],
  setArtists: (artists) => set({ artists }),
  currentTrack: null,
  setCurrentTrack: (track) => set({ currentTrack: track }),
  currentTrackUrl: '',
  setCurrentTrackUrl: (url) => set({ currentTrackUrl: url }),
  isPlayerReady: false,
  setIsPlayerReady: (ready) => set({ isPlayerReady: ready }),
  deviceId: null,
  setDeviceId: (id) => set({ deviceId: id }),
  currentTrackIndex: 0,
  setCurrentTrackIndex: (index) => set({currentTrackIndex:index}),
  isPlayerInitialized: false,
  setIsPlayerInitialized: (initialized) => set({ isPlayerInitialized: initialized }),
  isMusicPlay: false,
  setIsMusicPlay: (play) => set((state) => {
    
    if (state.isMusicPlay !== play) {
      return { isMusicPlay: play };
    }
    return state;
  }),
  player: null,
  setPlayer: (player) => {
    if (player) {
      player.addListener('player_state_changed', (state) => {
        if (state) {
          set({ currentTrackPosition: state.position });
        }
      });
      player.addListener('ready', ({ device_id }) => {
        set({ deviceId: device_id, isPlayerReady: true });
      });
    }
    set({ player });
  },
  initializePlayer: (token) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5
      });

      set({ player });

      player.addListener('ready', ({ device_id }) => {
        set({ isPlayerReady: true, deviceId: device_id });
      });

      player.addListener('not_ready', ({ device_id }) => {
        set({ isPlayerReady: false, deviceId: null });
      });

      player.addListener('player_state_changed', (state) => {
        if (!state) return;

        const { position, duration } = state;
        const remainingTime = duration - position;

        if (remainingTime < 1000 && get().isMusicPlay) {
          get().onNextTrack();
        }
      });

      player.connect();
    };
  },
  loginToken: null,
  setLoginToken: (token) => set({ loginToken: token }),
  currentTrackPosition: 0,
  setCurrentTrackPosition: (position) => set({ currentTrackPosition: position }),

  handlePause: async () => {
    const { deviceId, access_token, isPlayerReady, player } = get();

    if (!isPlayerReady || !deviceId || !player) return;

    player._options.getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      })
      .then(response => {
        if (!response.ok) {
          console.error('Failed to pause track:', response);
        }
      });
    });
  },

  handlePlay: async (trackUri) => {
    const { deviceId, access_token, isPlayerReady, player, currentTrackPosition } = get();
    if (!isPlayerReady || !deviceId || !player) return;

    player._options.getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri], position_ms: currentTrackPosition }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      })
      .then(response => {
        if (!response.ok) {
          console.error('Failed to play track:', response);
        }
      });
    });
  },

    playtrack: (track) => {
    const {handlePause,setCurrentTrack, isPlayerReady,setIsMusicPlay, player, isMusicPlay, handlePlay, deviceId, access_token } = get();
    if (!isPlayerReady || !deviceId) return;
    if (isMusicPlay){
    handlePause(deviceId, access_token, isPlayerReady,player);
    setIsMusicPlay(false)
    }else{
      handlePlay(track.uri, deviceId, access_token, isPlayerReady,player);
      setIsMusicPlay(true)
      setCurrentTrack(track)
      
    }
    
  },
    playtrack_player: () => {
    const {handlePause,setIsMusicPlay,currentTrack, isPlayerReady, player, isMusicPlay, handlePlay, deviceId, access_token } = get();
    if (!currentTrack) return;
    if (isMusicPlay) {
      handlePause(deviceId, access_token, isPlayerReady, player);
      setIsMusicPlay(false);
    } else {
      handlePlay(currentTrack.uri, deviceId, access_token, isPlayerReady, player);
      setIsMusicPlay(true);
      
    }
  },
   onNextTrack: () => {
    const {currentTrack, toptracks, playtrack, setCurrentTrackPosition } = get();
    if (!currentTrack || !toptracks.length) return;
    setCurrentTrackPosition(0);
    const currentIndex = toptracks.findIndex(({ track }) => track.uri === currentTrack.uri);
    const nextTrack = toptracks[(currentIndex + 1) % toptracks.length].track;
    playtrack(nextTrack);
  },

    onPreviousTrack: () => {
    const {currentTrack, toptracks, playtrack , setCurrentTrackPosition} = get();
    setCurrentTrackPosition(0);
    if (!currentTrack || !toptracks.length) return;
    const currentIndex = toptracks.findIndex(({ track }) => track.uri === currentTrack.uri);
    const previousTrack = toptracks[(currentIndex - 1 + toptracks.length) % toptracks.length].track;
    playtrack(previousTrack);
  },
   
  
}));

export default usePlayerStore;

