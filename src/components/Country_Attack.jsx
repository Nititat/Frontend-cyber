import React, { useState, useEffect } from "react";
import "../components/css/CountryAttack.css";
import axiosInstance from "../utils/axiosInstance"; // ใช้ axiosInstance แทน axios

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
  "Afghanistan": "af",
  "Albania": "al",
  "Algeria": "dz",
  "Andorra": "ad",
  "Angola": "ao",
  "Antigua and Barbuda": "ag",
  "Argentina": "ar",
  "Armenia": "am",
  "Australia": "au",
  "Austria": "at",
  "Azerbaijan": "az",
  "Bahamas": "bs",
  "Bahrain": "bh",
  "Bangladesh": "bd",
  "Barbados": "bb",
  "Belarus": "by",
  "Belgium": "be",
  "Belize": "bz",
  "Benin": "bj",
  "Bhutan": "bt",
  "Bolivia": "bo",
  "Bosnia and Herzegovina": "ba",
  "Botswana": "bw",
  "Brazil": "br",
  "Brunei": "bn",
  "Bulgaria": "bg",
  "Burkina Faso": "bf",
  "Burundi": "bi",
  "Cabo Verde": "cv",
  "Cambodia": "kh",
  "Cameroon": "cm",
  "Canada": "ca",
  "Central African Republic": "cf",
  "Chad": "td",
  "Chile": "cl",
  "China": "cn",
  "Colombia": "co",
  "Comoros": "km",
  "Congo (Congo-Brazzaville)": "cg",
  "Congo (DRC)": "cd",
  "Costa Rica": "cr",
  "Cote d'Ivoire (Ivory Coast)": "ci",
  "Croatia": "hr",
  "Cuba": "cu",
  "Cyprus": "cy",
  "Czechia (Czech Republic)": "cz",
  "Denmark": "dk",
  "Djibouti": "dj",
  "Dominica": "dm",
  "Dominican Republic": "do",
  "Ecuador": "ec",
  "Egypt": "eg",
  "El Salvador": "sv",
  "Equatorial Guinea": "gq",
  "Eritrea": "er",
  "Estonia": "ee",
  "Eswatini (fmr. Swaziland)": "sz",
  "Ethiopia": "et",
  "Fiji": "fj",
  "Finland": "fi",
  "France": "fr",
  "Gabon": "ga",
  "Gambia": "gm",
  "Georgia": "ge",
  "Germany": "de",
  "Ghana": "gh",
  "Greece": "gr",
  "Grenada": "gd",
  "Guatemala": "gt",
  "Guinea": "gn",
  "Guinea-Bissau": "gw",
  "Guyana": "gy",
  "Haiti": "ht",
  "Holy See (Vatican City)": "va",
  "Honduras": "hn",
  "Hungary": "hu",
  "Iceland": "is",
  "India": "in",
  "Indonesia": "id",
  "Iran": "ir",
  "Iraq": "iq",
  "Ireland": "ie",
  "Israel": "il",
  "Italy": "it",
  "Jamaica": "jm",
  "Japan": "jp",
  "Jordan": "jo",
  "Kazakhstan": "kz",
  "Kenya": "ke",
  "Kiribati": "ki",
  "Korea (North)": "kp",
  "Korea (South)": "kr",
  "Kosovo": "xk",
  "Kuwait": "kw",
  "Kyrgyzstan": "kg",
  "Laos": "la",
  "Latvia": "lv",
  "Lebanon": "lb",
  "Lesotho": "ls",
  "Liberia": "lr",
  "Libya": "ly",
  "Liechtenstein": "li",
  "Lithuania": "lt",
  "Luxembourg": "lu",
  "Madagascar": "mg",
  "Malawi": "mw",
  "Malaysia": "my",
  "Maldives": "mv",
  "Mali": "ml",
  "Malta": "mt",
  "Marshall Islands": "mh",
  "Mauritania": "mr",
  "Mauritius": "mu",
  "Mexico": "mx",
  "Micronesia": "fm",
  "Moldova": "md",
  "Monaco": "mc",
  "Mongolia": "mn",
  "Montenegro": "me",
  "Morocco": "ma",
  "Mozambique": "mz",
  "Myanmar (Burma)": "mm",
  "Namibia": "na",
  "Nauru": "nr",
  "Nepal": "np",
  "Netherlands": "nl",
  "New Zealand": "nz",
  "Nicaragua": "ni",
  "Niger": "ne",
  "Nigeria": "ng",
  "North Macedonia (formerly Macedonia)": "mk",
  "Norway": "no",
  "Oman": "om",
  "Pakistan": "pk",
  "Palau": "pw",
  "Palestine State": "ps",
  "Panama": "pa",
  "Papua New Guinea": "pg",
  "Paraguay": "py",
  "Peru": "pe",
  "Philippines": "ph",
  "Poland": "pl",
  "Portugal": "pt",
  "Qatar": "qa",
  "Romania": "ro",
  "Russia": "ru",
  "Rwanda": "rw",
  "Saint Kitts and Nevis": "kn",
  "Saint Lucia": "lc",
  "Saint Vincent and the Grenadines": "vc",
  "Samoa": "ws",
  "San Marino": "sm",
  "Sao Tome and Principe": "st",
  "Saudi Arabia": "sa",
  "Senegal": "sn",
  "Serbia": "rs",
  "Seychelles": "sc",
  "Sierra Leone": "sl",
  "Singapore": "sg",
  "Slovakia": "sk",
  "Slovenia": "si",
  "Solomon Islands": "sb",
  "Somalia": "so",
  "South Africa": "za",
  "South Sudan": "ss",
  "Spain": "es",
  "Sri Lanka": "lk",
  "Sudan": "sd",
  "Suriname": "sr",
  "Sweden": "se",
  "Switzerland": "ch",
  "Syria": "sy",
  "Tajikistan": "tj",
  "Tanzania": "tz",
  "Thailand": "th",
  "Timor-Leste": "tl",
  "Togo": "tg",
  "Tonga": "to",
  "Trinidad and Tobago": "tt",
  "Tunisia": "tn",
  "Turkey": "tr",
  "Turkmenistan": "tm",
  "Tuvalu": "tv",
  "Uganda": "ug",
  "Ukraine": "ua",
  "United Arab Emirates": "ae",
  "United Kingdom": "gb",
  "United States of America": "us",
  "Uruguay": "uy",
  "Uzbekistan": "uz",
  "Vanuatu": "vu",
  "Venezuela": "ve",
  "Vietnam": "vn",
  "Yemen": "ye",
  "Zambia": "zm",
  "Zimbabwe": "zw"
};


function Country_Attack() {
  const [countries, setCountries] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchCountries = async () => {
    try {
      const API_IP = import.meta.env.VITE_API_IP; 
      const API_PORT = import.meta.env.VITE_API_PORT; 
      const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/today-attacks`;

      const response = await axiosInstance.get(API_ENDPOINT); 
      const data = response.data;

      const formattedCountries = data.map((item) => {
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

  const handleClose = () => {
    setIsCollapsed(true);
  };

  const handleOpen = () => {
    setIsCollapsed(false);
  };

  return (
    <>
      {isCollapsed ? (
        <button className="reopen-icon" onClick={handleOpen}>
          <img src="/public/new-window-removebg-preview.png" alt="Reopen" />
        </button>
      ) : (
        <div className="popup-container">
          <div className="popup-header">
            <h2 className="popup-title">TOP TARGETED COUNTRIES</h2>
            <button className="close-button" onClick={handleClose}>
              &times;
            </button>
          </div>
          <p className="popup-subtitle">
            Highest rate of attacks per organization in the last day.
          </p>
          <div className="popup-content">
            {countries.length > 0 ? (
              countries.map((country, index) => (
                <div key={index} className="popup-item">
                  <img
                    src={country.flag}
                    alt={`${country.name} Flag`}
                    className="popup-item-image"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/50";
                    }}
                  />
                  <div className="popup-item-info">
                    <p className="popup-item-name">{country.name}</p>
                    <p className="popup-item-details">
                      {country.count.toLocaleString()} Attacks
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="loading-text">Loading data...</p>
            )}
          </div>
          
        </div>
      )}
    </>
  );
}

export default Country_Attack;
