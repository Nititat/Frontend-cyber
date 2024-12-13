import React, { useState, useEffect } from "react";
import "../components/css/CountryAttack.css";
import axios from "axios";

function Country_Attack() {
  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    try {
      // Fetch top countries data
      const response = await axios.get("http://127.0.0.1:5000/api/today-attacks"); // Replace with your API URL
      const data = response.data;

      // Fetch country flags using an alternative API
      const countryNames = data.map((item) => item.country);
      const flagResponses = await Promise.all(
        countryNames.map(async (name) => {
          try {
            const res = await axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
            return {
              name,
              flag: res.data[0]?.flags?.svg || "",
            };
          } catch {
            return { name, flag: "" }; // Default to empty flag if API call fails
          }
        })
      );

      // Combine attack count and flag
      const formattedCountries = data.map((item) => {
        const flagData = flagResponses.find((f) => f.name.toLowerCase() === item.country.toLowerCase());
        return {
          name: item.country,
          count: item.count,
          flag: flagData?.flag || "https://via.placeholder.com/50", // Default to a placeholder image if no flag is found
        };
      });

      setCountries(formattedCountries);
    } catch (error) {
      console.error("Error fetching country data or flags:", error);
    }
  };

  useEffect(() => {
    fetchCountries(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchCountries(); // Fetch data every 1 minute
    }, 60000); // 60 seconds interval

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flag-grid-container">
      <p className="dropdown-title">TOP TARGETED COUNTRIES</p>
      <div className="flag-grid">
        {countries.length > 0 ? (
          countries.map((country, index) => (
            <div key={index} className="flag-item">
              <img
                src={country.flag}
                alt={`${country.name} Flag`}
                className="flag-img"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/50"; // Fallback for missing images
                }}
              />
              <p className="flag-count">
                {country.count.toLocaleString()} Attacks
              </p>
            </div>
          ))
        ) : (
          <p className="loading-text">Loading data...</p> // Show this while data is being fetched
        )}
      </div>
    </div>
  );
}

export default Country_Attack;
