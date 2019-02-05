import React from 'react';
import './PlayList.css';

import TrackList from '../TrackList/TrackList';

export default class Playlist extends React.Component {
  constructor (props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  render () {
    return (
      <div className="Playlist">
        <input defaultValue="New Playlist" onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={false}/>
        <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
      </div>
    );
  }

  handleNameChange (ev) {
    this.props.onNameChange(ev.target.value);

  }
}
