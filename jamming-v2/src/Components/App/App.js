import React from 'react';

import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';

Spotify.getAccessToken();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName: "",
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          < SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            < SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            < PlayList
            playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
          />
          </div>
        </div>
      </div>
    );
  
  }

  addTrack (newTrack) {
    let savedTracks = this.state.playlistTracks;

    if(savedTracks.find((track) => {
      return (newTrack.id === track.id);
    })) return;

    // not seen track
    savedTracks.push(newTrack);
    this.setState({playlistTracks: savedTracks});
  }

  removeTrack (trackToRemove) {
    let savedTracks = this.state.playlistTracks;
    let filteredtracks = savedTracks.filter(savedTrack => trackToRemove.id !== savedTrack.id);

    this.setState({playlistTracks: filteredtracks});
  }

  updatePlaylistName (playListName) {
    this.setState({playListName: playListName});
  }

  savePlaylist () {
    const trackURIs = this.state.playlistTracks.map((track) => {
     return track.uri;
    });
    
    console.log(trackURIs);
    Spotify.savePlaylist(this.state.playListName, trackURIs);
    this.setState({playlistName: 'New Playlist'});
    this.setState({playlistTracks: []});
  }

  search (term) {
    Spotify.search(term).then(results => {
      this.setState({searchResults: results});   
    });
  }
}
