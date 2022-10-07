const AdminPage = ({ users }) => {
  const handleDelete = async (e) => {
    console.log(e.currentTarget.value);
    const response = await fetch(
      `http://localhost:2010/users/${e.currentTarget.value}`,
      {
        method: "DELETE",
      }
    );
    await response.json();
  };

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.name === "Admin"
                    ? user.password
                    : user.password.replace(/./g, "*")}
                </td>
                <td>
                  <button
                    value={user.id}
                    onClick={handleDelete}
                    style={{
                      display: user.name === "Admin" ? "none" : "block",
                    }}
                  >
                    <i className="fa fa-trash-o"></i>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
