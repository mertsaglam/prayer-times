import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import Cities from "../Cities";
import Button from "@mui/material/Button";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substr(0, 10)
  );

  const loadOptions = async (searchQuery, loadedOptions) => {
    const filteredCities = Cities.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      options: filteredCities.map((city) => ({
        value: { latitude: city.latitude, longitude: city.longitude },
        label: city.name,
      })),
      hasMore: false,
    };
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    //onSearchChange(searchData, selectedDate); // Return { latitude, longitude } to the parent
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const handleButtonClick = () => {
    console.log(search, selectedDate);
    onSearchChange(search, selectedDate);
  }

  return (
    <div>
      <AsyncPaginate
        placeholder="Şehir Giriniz"
        debounceTimeout={600}
        value={search}
        onChange={handleOnChange}
        loadOptions={loadOptions}
      />
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <Button onClick={handleButtonClick}>Namaz Saatlerini ara</Button>
    </div>
  );
};

export default Search;
