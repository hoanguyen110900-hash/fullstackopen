import { useState, useEffect } from 'react'
import axios from 'axios'
import countriesService from './services/countries'

const Filter = ({searchQuery,onSearchChange}) => {
  return (
    <div>
        find countries: <input value ={searchQuery} onChange={onSearchChange}/>
    </div>
  )
}

const Countries = ({countriesToShow, showCountry}) => {
  return (
    <div>
      {countriesToShow.map(country => (<div key={country.cca3}>{country.name.common}
          <button onClick={() => showCountry(country)}>show</button>
        </div>
      ))}
    </div>
  )
}

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  const [lat, lon] = country.capitalInfo?.latlng || []
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

  useEffect(() => {
    if (lat&&lon) {
      axios
        .get(url)
        .then(response => {setWeather(response.data)})
        .catch(error => {console.error('Error fetching weather data:',error)})
    }},[url, lat, lon])

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>Capital: {country.capital?.[0]}</p>
      <p>Area: {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt}
      />

      <h3>Weather in {country.capital?.[0]}</h3>
      {!weather ? (<div>Loading weather...</div>) 
      : (
        <div>
          <p>Temperature {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}/>
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}

    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)})},[])
  
  const countriesToShow = searchQuery
  ? countries.filter(country => country.name.common.toLowerCase().includes(searchQuery.toLowerCase()))
  : []

  const showCountry = (country) => {setSearchQuery(country.name.common)}

  const handleSearchChange = (event) => {setSearchQuery(event.target.value)}

  return (
    <div>
      <Filter searchQuery={searchQuery} onSearchChange={handleSearchChange}/>
    
    {searchQuery === '' ? (<p>Type a country name to begin searching.</p>)
    : countriesToShow.length > 10 ? (<p>Too many matches, specify another filter</p>) 
    : countriesToShow.length > 1 ? (<Countries countriesToShow={countriesToShow} showCountry={showCountry}/>) 
    : countriesToShow.length === 1 ? (<Country country={countriesToShow[0]} />) 
    : (<p>No matches</p>)}

    </div>)

}
export default App