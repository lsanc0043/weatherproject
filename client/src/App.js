import "./App.css";
import UserLogin from "./components/UserLogin";
import { useState } from "react";

function App() {
  const [show, setShow] = useState(false);

  return (
    <div className="App">
      <div className="tablet">
        {show ? (
          <UserLogin show={show} />
        ) : (
          <div className="content">
            <button
              className="weather-app"
              onClick={() => setShow(true)}
            ></button>
          </div>
        )}
        <button className="home" onClick={() => setShow(false)}></button>
      </div>
    </div>
  );
}

export default App;
