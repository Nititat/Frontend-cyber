import React, { useState, useEffect } from "react";
import "../components/css/CountryAttack.css";
import axios from "axios";

// แมปชื่อประเทศกับรหัส ISO 2 ตัว
const countryToISO = {
  "United States": "us",
  "Bulgaria": "bg",
  "China": "cn",
  "Germany": "de",
  "Russia": "ru",
  "Netherlands": "nl",
  "The Netherlands": "nl",
  "Belgium": "be",
  "Singapore": "sg",
  "United Kingdom": "gb",
  "India": "in",
  "Canada": "ca",
  "Thailand": "th",
  "Brazil": "br",
  "France": "fr",
  "South Korea": "kr",
  "Vietnam": "vn",
  "Ukraine": "ua",
  "Taiwan": "tw",
  "Hong Kong": "hk",
  "Japan": "jp",
  "Cambodia": "kh",
  "Sweden": "se",
  "Cyprus": "cy",
  "Romania": "ro",
  "Norway": "no",
  "Spain": "es",
  "Italy": "it",
  "Australia": "au",
  "Israel": "il",
  "Poland": "pl",
  "Malaysia": "my",
  "Bangladesh": "bd",
  "South Africa": "za",
  "Denmark": "dk",
  "Ireland": "ie",
  "Indonesia": "id",
  "Republic of Lithuania": "lt",
  "Lithuania": "lt",
  "Ethiopia": "et",
  "Iran": "ir",
  "Latvia": "lv",
  "Switzerland": "ch",
  "United Arab Emirates": "ae",
  "Turkey": "tr",
  "Türkiye": "tr",
  "Portugal": "pt",
  "Czechia": "cz",
  "Kazakhstan": "kz",
  "Mexico": "mx",
  "Lebanon": "lb",
  "Peru": "pe",
  "Argentina": "ar",
  "Luxembourg": "lu",
  "Republic of Moldova": "md",
  "Moldova": "md",
  "Iraq": "iq",
  "Pakistan": "pk",
  "Finland": "fi",
  "Georgia": "ge",
  "Philippines": "ph",
  "Panama": "pa",
  "Uzbekistan": "uz",
  "Tunisia": "tn",
  "Mozambique": "mz",
  "Chile": "cl",
  "Colombia": "co",
  "Algeria": "dz",
  "Greece": "gr",
  "Senegal": "sn",
  "Austria": "at",
  "Turkmenistan": "tm",
  "Costa Rica": "cr",
  "Afghanistan": "af",
  "Nigeria": "ng",
  "Tanzania": "tz",
  "Croatia": "hr",
  "Macao": "mo",
  "Seychelles": "sc",
  "Uganda": "ug",
  "Estonia": "ee",
  "Morocco": "ma",
  "Bolivia": "bo",
  "New Zealand": "nz",
  "Bosnia and Herzegovina": "ba",
  "Cameroon": "cm",
  "Azerbaijan": "az",
  "Nicaragua": "ni",
  "Hungary": "hu",
  "Belarus": "by",
  "Niger": "ne",
  "Egypt": "eg",
  "Mongolia": "mn",
  "El Salvador": "sv",
  "Mali": "ml",
  "North Macedonia": "mk",
  "Kenya": "ke",
  "Slovakia": "sk",
  "Bahrain": "bh",
  "Saudi Arabia": "sa",
  "Brunei": "bn",
  "Zambia": "zm",
  "Venezuela": "ve",
  "Gambia": "gm",
  "Uruguay": "uy",
  "Ecuador": "ec",
  "Puerto Rico": "pr",
  "Kuwait": "kw",
  "Dominican Republic": "do",
  "Liberia": "lr",
  "Armenia": "am",
  "Albania": "al",
  "Sri Lanka": "lk",
  "Nepal": "np",
  "Zimbabwe": "zw",
  "Libya": "ly",
  "Syria": "sy",
  "Serbia": "rs",
  "Turks and Caicos Islands": "tc",
  "Iceland": "is",
  "Mauritius": "mu",
  "Ghana": "gh",
  "Trinidad and Tobago": "tt",
  "Belize": "bz",
  "Palestine": "ps",
  "Cabo Verde": "cv",
  "Malta": "mt",
  "Comoros": "km",
  "Sierra Leone": "sl",
  "Laos": "la",
  "Cuba": "cu",
  "Eritrea": "er",
  "Cayman Islands": "ky",
  "Slovenia": "si",
  "Jamaica": "jm",
  "Guadeloupe": "gp",
  "Jordan": "jo",
  "Oman": "om",
  "Mauritania": "mr",
  "Malawi": "mw",
  "Monaco": "mc",
  "Saint Martin": "mf",
  "Kyrgyzstan": "kg",
  "Honduras": "hn",
  "Rwanda": "rw",
  "Andorra": "ad",
  "Myanmar": "mm",
  "Bonaire, Sint Eustatius, and Saba": "bq",
  "Wallis and Futuna": "wf",
  "Angola": "ao",
  "Equatorial Guinea": "gq",
  "Qatar": "qa",
  "Curaçao": "cw",
  "Eswatini": "sz",
  "Aruba": "aw",
  "Bermuda": "bm",
  "Bahamas": "bs",
  "Bhutan": "bt",
  "Namibia": "na",
  "Saint Pierre and Miquelon": "pm",
  "Barbados": "bb",
  "Botswana": "bw",
  "Gibraltar": "gi",
  "Ivory Coast": "ci",
  "Maldives": "mv",
  "Madagascar": "mg",
  "French Polynesia": "pf",
  "Tajikistan": "tj",
  "Yemen": "ye",
  "Hashemite Kingdom of Jordan": "jo",
  "Jordan": "jo",
  "Faroe Islands": "fo",
};


function Country_Attack() {
  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/today-attacks");
      const data = response.data;

      const formattedCountries = data.map((item) => {
        // แปลงชื่อประเทศเป็นรหัส ISO
        const countryCode = countryToISO[item.country] || item.country.slice(0, 2).toLowerCase();
        const flagPath = `/png100px/${countryCode}.png`;


        return {
          name: item.country,
          count: item.count,
          flag: flagPath,
        };
      });

      setCountries(formattedCountries);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    const intervalId = setInterval(fetchCountries, 60000); // Fetch data every 1 minute
    return () => clearInterval(intervalId);
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
                  e.target.src = "https://via.placeholder.com/50"; // แสดง placeholder ถ้าไม่มีธง
                }}
              />
              <p className="flag-count">
                {country.count.toLocaleString()} Attacks
              </p>
            </div>
          ))
        ) : (
          <p className="loading-text">Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default Country_Attack;
