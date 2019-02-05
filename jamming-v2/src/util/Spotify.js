const clientId = "600f391842c44f599abe80f488bcb294";
const redicrectUri = "http://localhost:3000/";

let accessToken;
const Spotify = {
  getAccessToken () {
    if (accessToken) return accessToken;

    const url = window.location.href;
    const newAccessToken = url.match(/access_token=([^&]*)/);
    const expiresIn = url.match(/expires_in=([^&]*)/);

    if (!newAccessToken) {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redicrectUri}`;
    } else {
      accessToken = newAccessToken[1];
      window.setTimeout(() => accessToken = '', expiresIn[1] * 1000);
      window.history.pushState('Access Token', null, '/');
    }
  },

  search (term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request to spoti failed ..');
    }).then((jsonResponse) => {
      if (!jsonResponse.tracks) return [];
      return jsonResponse.tracks.items.map(track => ({id: track.id, name: track.name, artist: track.artists[0].name, album: track.album.name, uri: track.uri }));
    });
  },

  savePlaylist (playListName, uriList) {
    if (!playListName || !uriList) return;
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userId = "";

    // Get spotify user information
    fetch('https://api.spotify.com/v1/me', {headers: headers}).then((response) => {
      if(response.ok) {
        return response.json();
      }
      throw new Error('Request to spoti failed ..');
    }).then((jsonResponse) => {
      const userId = jsonResponse.id;

      // Create new playlist
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playListName})
      }).then((response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request to spoti failed ..');
      })).then((jsonResponse) => {
        const playlistID = jsonResponse.id;

        // Set tracks to playlist    
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,{
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: uriList})
        }).then((response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request to spoti failed ..');
        })).then((jsonResponse) => {
          const snapshotId = jsonResponse.id;
          console.log("snapshot on:" + JSON.stringify(jsonResponse));
          return snapshotId;
        });
      });
    });
  }
};


export default Spotify;
