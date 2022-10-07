import { useState, useEffect } from "react";
import WeatherCard from "./WeatherCard";

const UserPage = ({ showFaves, user }) => {
  const [search, setSearch] = useState("");
  const [faves, setFaves] = useState([]);
  const [del, setDelete] = useState(0);
  const [history, setHistory] = useState([]);

  const getFaves = async () => {
    const response = await fetch(`http://localhost:2010/faves/${user[0].id}`);
    const data = await response.json();
    // console.log(data);
    setFaves(data);
  };

  const getHistory = async () => {
    const response = await fetch("http://localhost:2010/search");
    const data = await response.json();
    setHistory(
      [
        ...new Set(
          data
            .filter((val) => val.userid === Number(user[0].id))
            .map((val) => val.query.toLowerCase())
        ),
      ].splice(0, 7)
    );
  };

  useEffect(() => {
    getFaves();
    getHistory();
    // eslint-disable-next-line
  }, [user, showFaves, faves]);

  const postData = async () => {
    const firstResponse = await fetch("http://localhost:2010/search", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchInput: search, userid: user[0].id }),
    });
    const content = await firstResponse.json();
    console.log(content);
    postCity(content[0]);
  };

  const postCity = async (coordData) => {
    const secondResponse = await fetch("http://localhost:2010/search/weather", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coordData),
      // body: JSON.stringify({
      //   lat: 51.5073219,
      //   lon: -0.1276474,
      //   // searchInput: search,
      // }),
    });
    const data = await secondResponse.json();
    console.log(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postData(search);
    console.log(search);
    setSearch("");
  };

  const handleDelete = async (e) => {
    setDelete(del + 1);
    const city = faves.filter(
      (fave) => fave.id === Number(e.currentTarget.value)
    );
    console.log(city);
    const response = await fetch(
      `http://localhost:2010/faves/${user[0].id}${city[0].city}`,
      {
        method: "DELETE",
      }
    );
    await response.json();
  };

  return (
    <div className="user-page">
      {showFaves ? (
        <table className="table faves">
          <thead>
            <tr>
              <th>City</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {faves.map((fave, index) => {
              return (
                <tr key={index}>
                  <td>{fave.city}</td>
                  <td>
                    <button value={fave.id} onClick={handleDelete}>
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <label>
              See the weather in:
              <input
                type="text"
                value={search}
                autoComplete="off"
                onChange={(e) => setSearch(e.target.value)}
                list="history"
              />
            </label>
            <datalist id="history" value={search}>
              {history.map((entry, index) => {
                return <option key={index}>{entry}</option>;
              })}
            </datalist>
            <input type="submit" />
          </form>
          <WeatherCard search={search} user={user} faves={faves} />
        </>
      )}
    </div>
  );
};

export default UserPage;
