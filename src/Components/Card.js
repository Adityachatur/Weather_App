import React, { useState, useEffect } from 'react';
import './Card.css'

// mui material icon links
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import CompressIcon from '@mui/icons-material/Compress';
import AirIcon from '@mui/icons-material/Air';

//font-awesome links
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faCloudRain, faSmog, faSun, faSearch, faPercent } from '@fortawesome/free-solid-svg-icons'



const Card = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [searchcity, setsearchcity] = useState("Pune");
  const [updateweather, setupdateweather] = useState({});
  const [weatherIcon, setWeatherIcon] = useState(null);


  useEffect(() => {
    // Function to update date, time, and day
    const updateDateTime = () => {
      const now = new Date();

      // Format date, time, and day using Intl.DateTimeFormat
      const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });

      const formattedDateTime = dateTimeFormatter.format(now);
      setCurrentDateTime(formattedDateTime);
    };

    // Update date, time, and day initially
    updateDateTime();

    // Update every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);


  const getsearchinfo = async () => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchcity}&units=metric&appid=5b64f608795d65f4caf842cc31cd456b`
      const res = await fetch(url);
      const data = await res.json();
      const { temp, humidity, pressure } = data.main;
      const { main: Weathername } = data.weather[0];
      const { name } = data;
      const { speed } = data.wind;
      const { country, sunset } = data.sys;

      // Convert sunset time to 12-hour clock format
      const sunsetDate = new Date(sunset * 1000);
      const sunsetHours = sunsetDate.getHours();
      const sunsetMinutes = sunsetDate.getMinutes();
      const formattedSunsetTime = `${(sunsetHours % 12) || 12}:${sunsetMinutes < 10 ? '0' : ''}${sunsetMinutes} ${(sunsetHours >= 12) ? 'PM' : 'AM'}`;


      const Updateweatherdata = {
        temp, humidity, pressure, Weathername, name, speed, country, sunset: formattedSunsetTime
      }
      setupdateweather(Updateweatherdata);

    } catch (error) {
      console.log(error);
    }
  }


  const weathertheamchange = async (Weathername) => {
    try {
      // Update weather icon based on Weathername
      switch (Weathername) {
        case 'Clouds':
          setWeatherIcon(<FontAwesomeIcon icon={faCloud} className='season-icon' />);
          break;
        case 'Clear':
          setWeatherIcon(<FontAwesomeIcon icon={faSun} className='season-icon' />);
          break;
        case 'Rain':
          setWeatherIcon(<FontAwesomeIcon icon={faCloudRain} className='season-icon' />);
          break;
        case 'Haze':
          setWeatherIcon(<FontAwesomeIcon icon={faSmog} className='season-icon' />);
          break;
        default:
          setWeatherIcon(null); // Set a default icon or handle other cases as needed
          break;
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getsearchinfo();
    weathertheamchange(updateweather.Weathername);
  }, [updateweather.Weathername]);




  return (
    <>
      <div className="Heading">
        <h1>Weather App</h1>
      </div>

      <div className="container">
        <div className="left-side">
          <div className="date-time">
            <h3>{currentDateTime.split(',')[0]} {currentDateTime.split(',')[1]} , </h3>
            <h3 >{currentDateTime.split(',')[2]}</h3>
          </div>
        </div>

        <div className="right-side">
          <div className="search-city">
            <input type="search" placeholder='Enter city Name:' value={searchcity} onChange={(e) => setsearchcity(e.target.value)} />
            <button className='icon' onClick={getsearchinfo}>< FontAwesomeIcon icon={faSearch} /></button>
          </div>
          <div className="season">{weatherIcon}</div>
          <h1 className='city-name'>{updateweather.name}</h1>

          <div className="weather-info">
            <div className="temperature">
              <h3>Today Temp</h3>
              <span>{updateweather.temp}&deg;</span>
            </div>
            <div className="descrip">
              <div className="weather-condition">
                <h3>{updateweather.Weathername}</h3>
              </div>
              <span>{updateweather.name},{updateweather.country}</span>
            </div>
          </div>


          <div className="temp-info">
            <div className="two-side-info">
              <div className="extra-info-icon">
                <WbTwilightIcon style={{ fontSize: "40px" }} />
              </div>
              <p>{updateweather.sunset} <br /><span>Sunset</span></p>
            </div>
            <div className="two-side-info">
              <div className="extra-info-icon">
                <FontAwesomeIcon icon={faPercent} style={{ fontSize: "40px" }} />
              </div>
              <p>{updateweather.humidity} (%)<br /><span>Humidity</span></p>
            </div>
            <div className="two-side-info">
              <div className="extra-info-icon"> <CompressIcon style={{ fontSize: "40px" }} /></div>
              <p>{updateweather.pressure} (hPa)<br /> <span>Pressure</span></p>
            </div>
            <div className="two-side-info">
              <div className="extra-info-icon">
                <AirIcon style={{ fontSize: "40px" }} />
              </div>
              <p>{updateweather.speed} (m/s)<br /> <span>Wind</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
