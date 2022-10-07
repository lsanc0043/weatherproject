import { useState, useEffect } from "react";

const WeatherCard = ({ search, user, faves }) => {
  const [weather, setWeather] = useState(null);
  const [fave, setFave] = useState([]);

  const loadData = async () => {
    const response = await fetch("http://localhost:2010/search/weather");
    const data = await response.json();
    if (faves.length > 0) {
      setFave(faves.map((fave) => fave.city));
    } else {
      setFave([0]);
    }
    setWeather(data);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [search, fave]);

  const convertTemp = (temp) => {
    return Math.round((((temp - 273.15) * 9) / 5 + 32) * 100) / 100;
  };

  const postFavorite = async (data) => {
    console.log(user[0].id);
    console.log("post", data);
    const response = await fetch("http://localhost:2010/faves", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user[0].id, city: data }),
    });
    const content = await response.json();
    console.log("content", content);
  };

  const deleteFavorite = async (data) => {
    const response = await fetch(
      `http://localhost:2010/faves/${user[0].id}${data}`,
      {
        method: "DELETE",
      }
    );
    await response.json();
  };

  const handleFavorite = (e) => {
    console.log(faves);
    const city = e.currentTarget.value;
    // const cities = faves.map((fave) => fave.city);
    if (!fave.includes(city)) {
      console.log("not there");
      postFavorite(city);
      setFave([...fave, city]);
    } else {
      deleteFavorite(city);
      console.log("there");
      fave.splice(fave.indexOf(city), 1);
    }
  };

  if (!weather || fave.length === 0) {
    return <>Loading...</>;
  } else {
    return (
      <div className="card">
        <h2
          className="card-title p-2"
          style={{ display: "flex", alignItems: "center" }}
        >
          {weather.city.name}
          <button
            value={weather.city.name}
            style={{ fontSize: "18px" }}
            onClick={handleFavorite}
          >
            <i
              className={
                fave.includes(weather.city.name) ? "fa fa-star" : "fa fa-star-o"
              }
            ></i>
          </button>
        </h2>
        <div
          className="header"
          style={{ display: "flex", alignItems: "center", marginTop: "-20px" }}
        >
          <img
            style={{ height: "100px", width: "100px" }}
            src={`http://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@4x.png`}
            className="card-img-top"
            alt={weather.list[0].weather[0].description}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h4 className="card-text">
            {convertTemp(weather.list[0].main.temp)}&deg;F
          </h4>
          <h5 className="card-text">{weather.list[0].weather[0].main}</h5>
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>Description: </strong>
            {weather.list[0].weather[0].description}
          </p>
          <p className="card-text">
            <strong>High is:</strong>{" "}
            {convertTemp(weather.list[0].main.temp_max)}&deg;F
            <br />
            <strong>Low is:</strong>{" "}
            {convertTemp(weather.list[0].main.temp_min)}&deg;F
          </p>
          <p className="card-text">
            <strong>Sunrise at: </strong>
            {new Date(weather.city.sunrise * 1000).toLocaleTimeString()} PST
            <br />
            <strong>Sunset at: </strong>
            {new Date(weather.city.sunset * 1000).toLocaleTimeString()} PST
          </p>
          <h5>
            <strong>Hourly Forecast</strong>
          </h5>
          <div className="slider">
            {weather.list.map((hour, index) => {
              const now = new Date();
              const date = new Date(hour.dt * 1000);
              if (date.getDate() - now.getDate() < 2) {
                return (
                  <div className="hourly" key={index}>
                    <p>{`${date.toLocaleTimeString()}`}</p>
                    <img
                      style={{
                        height: "100px",
                        width: "100px",
                        marginTop: "-30px",
                        marginBottom: "-10px",
                      }}
                      src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@4x.png`}
                      className="card-img-top"
                      alt={hour.weather[0].description}
                    />
                    <p>{convertTemp(hour.main.temp)}&deg;F</p>
                    <p>{`${date.toLocaleDateString()}`}</p>
                  </div>
                );
              } else {
                return <></>;
              }
            })}
          </div>
        </div>
      </div>
    );
  }
};

export default WeatherCard;
