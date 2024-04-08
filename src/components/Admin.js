// AdminPage.js
import React, { useState } from "react";
import "../App.css"; // Import CSS file

const AdminPage = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "user" // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement logic to add the new user
    console.log("New user submitted:", newUser);
    // Clear the form fields after submission
    setNewUser({
      username: "",
      email: "",
      role: "user"
    });
  };

  const handleModify = (userId) => {
    // Implement logic to modify the existing user
    console.log("Modify user with ID:", userId);
  };

  return (
    <div className="container">
      <h2>Admin Page</h2>
      <div className="admin-form">
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleChange}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            required
          />
          <label>Role:</label>
          <select name="role" value={newUser.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="page-button">Add User</button>
        </form>
      </div>
      <div>
        <h3>Modify Existing User</h3>
        <ul className="modify-user-list">
          <li>User 1 <button onClick={() => handleModify(1)} className="page-button">Modify</button></li>
          <li>User 2 <button onClick={() => handleModify(2)} className="page-button">Modify</button></li>
          {/* Add more users and modify buttons as needed */}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
