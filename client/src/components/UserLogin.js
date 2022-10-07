import { useState, useEffect } from "react";

import AdminPage from "./AdminPage.js";
import UserPage from "./UserPage.js";

const UserLogin = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const [showFaves, setShowFaves] = useState(false);
  const [realPass, setRealPass] = useState([]);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    username: "",
    log_in: new Date(),
  });

  const getUsers = async () => {
    const response = await fetch("http://localhost:2010/users");
    const data = await response.json();
    // console.log(data);
    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, [users]);

  const searchUsers = async (users) => {
    console.log(users);
    console.log(realPass);
    const filt = users.filter(
      (user) =>
        user.email === userInfo.email &&
        user.password ===
          realPass.join("").slice(realPass.join("").lastIndexOf("*") + 1)
    );
    console.log("filt", filt);
    if (filt.length > 0 && filt[0].name === "Admin") {
      setAdmin(true);
    } else {
      if (!users.map((user) => user.email).includes(userInfo.email)) {
        setError(
          "Email does not exist. Check for typos or make a new account."
        );
      } else {
        if (
          users.filter((user) => user.email === userInfo.email)[0].password !==
          userInfo.password
        ) {
          setError("Password is incorrect.");
        }
      }
      setAdmin(false);
    }
    setUser(filt);
    if (filt.length > 0) {
      const response = await fetch(
        `http://localhost:2010/users/${filt[0].id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: filt.id,
            email: filt.email,
            password: filt.password,
            name: filt.name,
          }),
        }
      );
      await response.json();
    }
  };

  const set = (input) => {
    return ({ target: { value } }) => {
      setUserInfo((oldValues) => ({ ...oldValues, [input]: value }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userInfo);
    if (newAccount) {
      const response = await fetch("http://localhost:2010/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      const content = await response.json();
      console.log("content", content);
    }
    setNewAccount(false);
    searchUsers(users);
  };

  const passwordChange = (e) => {
    console.log(e.target.value);
    if (
      e.target.value[e.target.value.length - 1] !== "*" &&
      e.target.value.length > 0
    ) {
      setRealPass([...realPass, e.target.value[e.target.value.length - 1]]);
    } else {
      if (e.target.value.length === 0) {
        setRealPass("");
      } else {
        realPass.pop();
      }
    }
    setUserInfo((oldValues) => ({ ...oldValues, password: e.target.value }));
    // console.log(userInfo.password);
  };

  return (
    <div className="app-content">
      {user.length === 0 ? (
        newAccount ? (
          <div className="signup">
            <strong>Make a new account!</strong>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email: </label> <br />
              <input type="email" id="email" required onChange={set("email")} />
              <br />
              <label htmlFor="password">Password: </label> <br />
              <input
                type="text"
                id="password"
                required
                autoComplete="off"
                onChange={set("password")}
              />
              <br />
              <label htmlFor="username">Username: </label> <br />
              <input
                type="text"
                id="username"
                required
                autoComplete="off"
                onChange={set("username")}
              />
              <br />
              <br />
              <button type="submit" className="submission">
                Create
              </button>
              <button
                className="submission"
                onClick={() => setNewAccount(false)}
              >
                Go Back
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="login">
              Welcome to <br />
              <strong>
                It's a Cloudy Chance for <em>What?</em>
              </strong>
              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email: </label> <br />
                <input
                  type="email"
                  id="email"
                  required
                  onChange={set("email")}
                />
                <br />
                <label htmlFor="password">Password: </label> <br />
                <input
                  type="text"
                  id="password"
                  required
                  autoComplete="off"
                  value={
                    showPass
                      ? realPass.join("")
                      : userInfo.password.replace(/./g, "*")
                  }
                  onChange={passwordChange}
                />
                <i
                  id="eye"
                  className="fa fa-eye"
                  aria-hidden="true"
                  onMouseOver={() => setShowPass(true)}
                  onMouseOut={() => setShowPass(false)}
                ></i>
                <br />
                <br />
                <p style={{ width: "200px", marginLeft: "15px" }}>{error}</p>
                <button type="submit" className="submission">
                  Login
                </button>
              </form>
              <button
                className="submission"
                onClick={() => setNewAccount(true)}
              >
                Signup
              </button>
            </div>
          </>
        )
      ) : (
        <div className="user-interface">
          <h4>
            Welcome, <strong>{user[0].name}</strong>
          </h4>
          {admin ? (
            <AdminPage users={users} />
          ) : (
            <UserPage showFaves={showFaves} user={user} />
          )}
          <button
            className="faves"
            style={{
              display: admin ? "none" : "inline-block",
              fontSize: "16px",
              textAlign: "right",
            }}
            onClick={() => setShowFaves((show) => !show)}
          >
            {showFaves ? "Go Back" : "See All Your Favorited Cities"}
          </button>
          <button
            className="logout"
            style={{
              fontSize: "16px",
              textAlign: "right",
            }}
            onClick={() => {
              setUser([]);
              setShowFaves(false);
              setRealPass([]);
              setUserInfo((oldValues) => ({ ...oldValues, password: "" }));
              setError("");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
