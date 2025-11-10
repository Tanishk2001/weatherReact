import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoApiOptions, GEO_API_URL } from "../../api";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);

  const loadOptions = async (inputValue) => {
    try {
      console.log('Searching for:', inputValue);
      console.log('API URL:', `${GEO_API_URL}/cities`);
      console.log('API Options:', geoApiOptions);

      const response = await fetch(
        `${GEO_API_URL}/cities?namePrefix=${inputValue}`,
        geoApiOptions
      );
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        return { options: [] };
      }
      
      const result = await response.json();
      console.log('API Success Response:', result);
      
      if (result.data && Array.isArray(result.data)) {
        return {
          options: result.data.map((city) => ({
            value: `${city.latitude} ${city.longitude}`,
            label: `${city.name}, ${city.countryCode}`,
          })),
        };
      } else {
        console.error('Unexpected API response format:', result);
        return { options: [] };
      }
    } catch (error) {
      console.error('Search Error:', error);
      return { options: [] };
    }
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
