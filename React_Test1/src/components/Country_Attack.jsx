import React from 'react';
import '../components/css/CountryAttack.css'; // Import the CSS file for styling

function Country_Attack() {
  const countries = [
    {
      name: "UNITED STATES",
      flag: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="20" height="15">
          <rect width="640" height="480" fill="#b22234" />
          <path fill="#fff" d="M0 37.4h640v37.4H0zM0 112.2h640v37.4H0zM0 187h640v37.4H0zM0 261.8h640v37.4H0zM0 336.6h640v37.4H0zM0 411.4h640v37.4H0z" />
          <path fill="#3c3b6e" d="M0 0h240v192H0z" />
          <g fill="#fff">
            <g id="d">
              <g id="c">
                <g id="e">
                  <path id="b" d="M8.2 0l2.5 7.7h8.2l-6.6 4.8 2.5 7.7-6.6-4.8-6.6 4.8 2.5-7.7-6.6-4.8h8.2z" />
                  <use href="#b" transform="translate(24)" />
                  <use href="#b" transform="translate(48)" />
                  <use href="#b" transform="translate(72)" />
                  <use href="#b" transform="translate(96)" />
                </g>
                <use href="#b" transform="translate(12 8)" />
                <use href="#b" transform="translate(36 8)" />
                <use href="#b" transform="translate(60 8)" />
                <use href="#b" transform="translate(84 8)" />
              </g>
              <use href="#e" transform="translate(0 16)" />
              <use href="#e" transform="translate(0 32)" />
              <use href="#e" transform="translate(0 48)" />
              <use href="#e" transform="translate(0 64)" />
              <use href="#e" transform="translate(0 80)" />
            </g>
            <use href="#c" transform="translate(0 16)" />
            <use href="#c" transform="translate(0 32)" />
            <use href="#c" transform="translate(0 48)" />
            <use href="#c" transform="translate(0 64)" />
            <use href="#c" transform="translate(0 80)" />
          </g>
        </svg>
      ),
    },
    {
      name: "CHINA",
      flag: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" width="20" height="15">
          <rect fill="#DE2910" width="30" height="20" />
          <path fill="#FFDE00" d="M5 2.5l-.588.902L3.72 3.57l.2-1.025L2.96 2.03l1.07-.25.27-1.05.27 1.05 1.07.25-.96.515.2 1.025zM7.8 4l.35-.543.87.126-.62.44.2.72-.7-.463-.7.463.2-.72-.62-.44.87-.126L7.8 4zm-1.18 2.9l.442-.287.282.443.117-.516.483-.148-.485-.132-.12-.518-.27.455-.49-.12.296.423-.27.458zm1.3 2.1l.328-.3.066.49.405-.34-.063.49.4-.347-.345.293.392.29-.472-.026.026.47-.345-.295-.345.294.026-.47-.473.026.392-.29z" />
        </svg>
      ),
    },
    // Add more countries similarly
  ];

  return (
    <div className="dropdown-container">
      <p className="dropdown-title">LOCATIONS</p>
      <ul className="dropdown-list">
        {countries.map((country, index) => (
          <li key={index} className="dropdown-item">
            <span className="flag">{country.flag}</span>
            <span className="country-name">{country.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Country_Attack;
