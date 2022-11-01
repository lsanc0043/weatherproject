import { useState, useEffect } from "react";

const SearchHistory = ({ search }) => {
  const [history, setHistory] = useState([]);
  const [editId, setEditId] = useState("");

  const loadHistory = async () => {
    const response = await fetch("http://localhost:2010/");
    const data = await response.json();
    setHistory([...data]);
  };

  useEffect(() => {
    loadHistory();
  }, [search, history]);

  const handleEdit = async (e) => {
    if (editId === Number(e.currentTarget.value)) {
      setEditId("");
    } else {
      setEditId(Number(e.currentTarget.value));
    }
    // const response = await fetch(
    //   `http://localhost:2010/${e.currentTarget.value}`,
    //   {
    //     method: "PUT",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-type": "application/json",
    //     },
    //     body: JSON.stringify(),
    //   }
    // );
    // const date = await response.json();
  };

  const handleDelete = async (e) => {
    const deleteId = Number(e.currentTarget.value);
    const response = await fetch(`http://localhost:2010/${deleteId}`, {
      method: "DELETE",
    });
    await response.json();
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Search Query</th>
          <th>Time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {history.map((search, index) => {
          const date = new Date(search.date_time);
          return (
            <tr key={index}>
              <td>
                <button value={search.id} onClick={handleEdit}>
                  <i
                    className={
                      editId === search.id ? "fa fa-times" : "fa fa-pencil"
                    }
                  ></i>
                </button>
              </td>
              <td>{editId === search.id ? <input></input> : search.query}</td>
              <td>{`${date.toLocaleString()}`}</td>
              <td>
                <button value={search.id} onClick={handleDelete}>
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SearchHistory;
