// Imports all the neccesities
import React from 'react';
import './App.css';
import Load from './loading.gif';  // The loading screen's icon


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      items: [],
      favs: [],
      searches: [],
      query: "",
      isLoaded: false,
      search: undefined,
      aType: "song",
      artName: undefined,
      tracName: undefined,
      genre: undefined,
      preview: undefined,
      selectVal: undefined, //selected favourite
      list: [] // List of Fav
    }
  }
  
  // Lifecycle method to call data from the data 
componentDidMount(){
  fetch('/api/favourites', { method: "GET", headers: {"Content-Type": "application/json"}})
    .then(res => res.json())
    .then(favs => this.setState({ favs }))
  if (this.state.search && this.state.type){
    fetch('/api', { method: "GET", headers: { "Content-Type": "application/json" } })
      .then(res => res.json())
      .then(json => this.setState({
        items: json,
        isLoaded: true
      }))
  
    this.setState({items: this.state.items.results})
  } else {
    this.setState({isLoaded: true})
  }
}

//  This function checks the 'type' and returns the appropriate data to the items state
mountAgain(){
  if (this.state.search && this.state.type){
    fetch('/api', { method: "GET", headers: { "Content-Type": "application/json"} })
    .then(res => res.json())
    .then(json => this.setState({
      items: json,
      isLoaded: true
    }))
  
    this.setState({items: this.state.items.results})
  } else {
    this.setState({isLoaded: true})
  }
} 
// Takes the input and searches the api for the values
mySubmitHandler = async (event) => { //async function
  event.preventDefault();
  this.setState({isLoaded: false})
  let term = this.state.search;
  let type = this.state.aType;
  const getMusic = await fetch(`/api?search=${term}&type=${type}`)
  let res = await getMusic.json()
  this.setState({ 
    items: res,
    isLoaded: true
  })
}

// Tracks the search bar and sets the state
myChangeHandler = (event) => {
  this.setState({search: event.target.value})
}

// Tracks the radio buttons and also sets the state
typeHandler = (event) => {
  this.setState({aType: event.target.value})
}

/* 
  Identifies the favourited song
  sets the "selectVal" state to the information of the song
  appends new favourited values to the same state
*/
  myFavSong = (item) => {
    alert(`You have favourited ${item.trackName}`)
    let values = {
      "art": item.artworkUrl100,
      "artistName": item.artistName,
      "trackName": item.trackName,
      "genre": item.previewGenreName,
      "preview": item.previewUrl
    }
    this.setState({ selectVal: values })
    console.log(this.state.selectVal)
    this.setState(state => {
      const list = state.list.concat((state.selectVal));
      return {
        list,
        value: ''
      }
    })
  }

  // The delete function deletes the selected favourite from the list
  onRemoveItem = (i) => {
    this.setState(state => {
      const list = state.list.filter((item, j) => i !== j);
      return {
        list
      }
    })
  }
  // Same favouriting function designed for videos and movies
  myFavVid = (item) => {
    alert(`You have favourited ${item.trackName}`)
    let values = {
      "art": item.artworkUrl100,
      "artistName": item.artistName,
      "trackName": item.trackName,
      "genre": item.previewGenreName,
      "preview": item.previewUrl
    }
    this.setState({ selectVal: values })
    console.log(this.state.selectVal)
    this.setState(state => {
      const list = state.list.concat((state.selectVal));
      return {
        list,
        value: ''
      }
    })    
  }


  render(){
    var { isLoaded, items, list } = this.state; 
    // Loading Screen
    if (!isLoaded) {
      return(
        <div><img id="loading" src={Load} alt="none" /></div>
      )
    // Starting up screen 
    } else if (!items) {
      return (
        <div className="App">
          <div className="header">
            <h2 className="search">iNeed</h2>
            <h4 style={{"backgroundColor":"white"}}>Satisfying your music, video and movie needs</h4>
          </div>
          <div className="body">
            <form> {/* The form to handle the requests */}
              <div className="flex">
                <div className="radioBtn">
                  <input type="radio" name="type" onClick={this.typeHandler} value="song" />Song
                </div>
                <div className="radioBtn">
                  <input type="radio" name="type" onClick={this.typeHandler} value="musicVideo" />Music Video
                </div>
                <div className="radioBtn">
                  <input id="radioVal" type="radio" name="type" onClick={this.typeHandler} value="movie" />Movie
                </div>
              </div>
                
                <input type="name" placeholder="search" className="searchBar" onChange={this.myChangeHandler}/>
              <input className="sub" type="submit" onClick={this.mySubmitHandler}/>
            </form>
          </div>
        </div>
      )
    }
    // Search results for songs
    else if (this.state.aType === "song"){
      return (
      
          <div className="App">
          <div className="header">
            <h2 className="search">iNeed</h2>
            <h4 style={{"backgroundColor":"white"}}>Satisfying your music, video and movie needs</h4>
          </div>
          <div className="body">
          <form>
              <div className="flex">
                <div className="radioBtn">
                  <input type="radio" name="type" onClick={this.typeHandler} value="song"/>Song
                </div>
                <div className="radioBtn">
                  <input type="radio" name="type" onClick={this.typeHandler} value="musicVideo" />Music Video
                </div>
                <div className="radioBtn">
                  <input type="radio" name="type" onClick={this.typeHandler} value="movie" />Movie
                </div>
              </div>
                
              <input type="name" placeholder="search" className="searchBar" onChange={this.myChangeHandler}/>
              <input className="sub" type="submit" onClick={this.mySubmitHandler}/>
            </form>
          </div>
          <div className="results">

            <table>
              <tbody>
                {/* Displays the information received from the API */}
                {items.map((item, key) => (
                  <tr key={key++}>
                    <td><img src={item.artworkUrl100} alt="none"/></td>
                    <td>{item.artistName}</td>
                    <td>{item.trackName}</td>
                    <td>{item.primaryGenreName}</td>
                    <td><audio src={item.previewUrl} controls/></td>
                    <button className="buttonIcon" onClick={() => this.myFavSong(item)}><i id="icon" class="fas fa-fire"></i></button>
                  </tr>
                ))}
              </tbody>
            </table>
          <hr />
          <h3>Favourites</h3>
          <table>
            <tbody>
              {/* Displays the favourites */}
              {list.map((i, index) => (
                <tr>
                  <td><img src={i.art} alt="none"/></td>
                  <td>{i.artistName}</td>
                  <td>{i.trackName}</td>
                  <td>{i.genre}</td>
                  <td><audio src={i.preview} controls /></td>
                  <button 
                    className="buttonIcon"
                    type="buton"
                    onClick={() => this.onRemoveItem(index)}
                    ><i id="icon" class="fas fa-recycle"></i></button>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )
    } else if (this.state.aType === "song" && this.state.favs.length() >= 0){
      return (
      
          <div className="App">
          <div className="header">
            <h2 className="search">iNeed</h2>
            <h4 style={{"backgroundColor":"white"}}>Satisfying your music, video and movie needs</h4>
          </div>
          <div className="body">
          <form>
              <div className="flex">
                <div className="radioBtn">
                  <input type="radio" name="type" onClick={this.typeHandler} value="song"/>Song
                </div>
                <div className="radioBtn">
                  <input type="radio" name="type" onClick={this.typeHandler} value="musicVideo" />Music Video
                </div>
                <div className="radioBtn">
                  <input type="radio" name="type" onClick={this.typeHandler} value="movie" />Movie
                </div>
              </div>
                
              <input type="name" placeholder="search" className="searchBar" onChange={this.myChangeHandler}/>
              <input className="sub" type="submit" onClick={this.mySubmitHandler}/>
            </form>
          </div>
          <div className="results">

            <table>
              <tbody>
                {items.map(item => (
                  <tr>
                    <td><img src={item.artworkUrl100} alt="none" controls/></td>
                    <td>{item.artistName}</td>
                    <td>{item.trackName}</td>
                    <td>{item.primaryGenreName}</td>
                    <td><audio src={item.previewUrl} controls/></td>
                    <button className="buttonIcon" onClick={() => this.myFav(item)}><i id="icon" class="fas fa-fire"></i></button>
                  </tr>
                ))}
              </tbody>
            </table>
          <hr />
          <h3>Favourites</h3>
          <table>
            <tbody>
              {list.map((i, index) => (
                <tr>
                  <td><img src={i.art} alt="none"/></td>
                  <td>{i.artistName}</td>
                  <td>{i.trackName}</td>
                  <td>{i.genre}</td>
                  <td><audio src={i.preview} controls /></td>
                  <button 
                    className="buttonIcon"
                    type="buton"
                    onClick={() => this.onRemoveItem(index)}
                    ><i id="icon" class="fas fa-recycle"></i></button>
                </tr>
              ))}
            </tbody>
          </table>
          
          </div>
        </div>
      )
    }

    //  Search results for video media
    else if(this.state.aType === "musicVideo" || this.state.aType === "movie"){
      return (
        <div className="App">
          <div className="header">
            <h2 className="search">iNeed</h2>
            <h4 style={{"backgroundColor":"white"}}>Satisfying your music, video and movie needs</h4>
          </div>
          <div className="body">
          <form>
            <div className="flex">
              <div className="radioBtn">
                <input type="radio" name="type" onClick={this.typeHandler} value="song"/>Song
              </div>
              <div className="radioBtn">
                <input type="radio" name="type" onClick={this.typeHandler} value="musicVideo" />Music Video
              </div>
              <div className="radioBtn">
                <input type="radio" name="type" onClick={this.typeHandler} value="movie" />Movie
              </div>
            </div>
     
              <input type="name" placeholder="search" className="searchBar" onChange={this.myChangeHandler}/>
              <input className="sub" type="submit" onClick={this.mySubmitHandler}/>
          </form>
          </div>
          <div className="results">
            <table>             
              <tbody>
                {items.map(item => (
                  <tr>
                    <td><img src={item.artworkUrl100} alt="none"/></td>
                    <td>{item.artistName}</td>
                    <td>{item.trackName}</td>
                    <td>{item.primaryGenreName}</td>
                    <td><video src={item.previewUrl} controls/></td>
                    <button className="buttonIcon" onClick={() => this.myFavVid(item)}><i id="icon" class="fas fa-fire"></i></button>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
            <h3>Favourites</h3>
            <table>
              <tbody>
              {list.map((i, index) => (
                <tr>
                  <td><img src={i.art} alt="none"/></td>
                  <td>{i.artistName}</td>
                  <td>{i.trackName}</td>
                  <td>{i.genre}</td>
                  <td><video src={i.preview} controls /></td>
                  <button 
                    className="buttonIcon"
                    type="buton"
                    onClick={() => this.onRemoveItem(index)}
                    ><i id="icon" class="fas fa-recycle"></i></button>
                </tr>
              ))}
              </tbody>
          </table>
          </div>
        </div>
      )
    }
    
    
  }
}

export default App;