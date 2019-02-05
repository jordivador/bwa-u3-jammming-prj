import React from 'react';
import './SearchBar.css';

export default class SearchBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {term: ""};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  render () {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <button onClick={this.search}>SEARCH</button>
      </div>
    );
  }

  handleTermChange (ev) {
    this.setState({term: ev.target.value});
  }

  search (ev) {
    this.props.onSearch(this.state.term);
  }
}
