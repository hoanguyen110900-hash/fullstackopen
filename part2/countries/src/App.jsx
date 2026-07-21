import { useState, useEffect } from 'react'
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