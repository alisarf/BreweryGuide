import React, {useState} from "react";
import ReactMapGL from 'react-map-gl';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';


//Brewery Finder
const meetupapi = {
  base: 'https://api.openbrewerydb.org/breweries?by_city='
}

const api = {
  key: "3a2b308bcf33b99a8500227f26bafdeb",
  base: "http://api.openweathermap.org/data/2.5/"
}




//mapbox

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [brewery, setBrewery] = useState();

  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "500px",
    height: "500px",
    zoom: 10
  });
  


  


//weather -> brewery once location set

  const search = evt => {
    if (evt.key === 'Enter') {
      //create url with data
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json()) //format to json result as promise
        .then(result => {
          setWeather(result) //set result as weather object
          searchGroups(query); //find breweries by location entered
          setQuery(''); //resets query search box after event
          console.log(result);
        });
    }
    
  }


  const searchGroups = (location) => {
    fetch(`${meetupapi.base}${location}`)
      .then(res => res.json()) //format to json result as promise
      .then(result => {
        //setBrewery(result.);
        console.log(result[0].website_url);
        let newresult = result.map(function(element){
          return <li><a href={element.website_url}>{element.name}</a></li>;
        });
        //newresult = newresult.slice(0,5);
        //console.log(newresult)
        setBrewery(newresult);
      });
  }



  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }


  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app')
      : 'app'}>
      <main>
        <div className="search-box">
          <input 
          type="text"
          className="search-bar"
          placeholder="Search..."
          onChange= {e => setQuery(e.target.value)}
          value = {query} //bind the value to query
          onKeyPress = {search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
          //check to make sure theres a value entered otherwise empty
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}
            </div>
            <div className="date">
              {dateBuilder(new Date())}
            </div>
          </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°C
            </div>
            <div className="weather">
              {weather.weather[0].main}
            </div>
          </div>
          <div className="meetup">
            <ul>
            {brewery}
            </ul>
          </div>

        </div>
        ):('')}
        
          <ReactMapGL        
          {...viewport}
        mapboxApiAccessToken={"pk.eyJ1IjoiYWxpZmFyZXNib3Vsb3MiLCJhIjoiY2t3NWs5aWdzNmUxZTJubzB0dXhuMjJjZyJ9.gF9Yte_ZD6xwUJKf8oyyyg"}
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
            >Markers here
            </ReactMapGL>
        
      </main>
    </div>
  );
}

export default App;
