import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../config.json';
import './Usercss.css'; // Import the CSS file

/**
 * Retrieves all the users from the API.
 *
 * @return {Promise<Array>} An array of user objects.
 */
async function getAllUsers() {
  try {
    const url = `${config.baseURL}/user`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

/**
 * Deletes a user from the API.
 *
 * @param {number} id - The ID of the user to delete.
 * @return {Promise<void>} - A promise that resolves when the user is deleted.
 * @throws {Error} - If an error occurs during the deletion process.
 */
async function deleteUser(id) {
  try {
    const url = `${config.baseURL}/user/${id}`;
    const response = await axios.delete(url);
    if (response.status === 200) {
      console.log('User deleted successfully');
    } else {
      console.log('User not deleted');
      throw new Error('User not deleted');
    }
  } catch (error) {
    console.error(error.message);
  }
}

const User = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllUsers().then((res) => {
      setUsers(res.users);
      const uniqueRoles = [...new Set(res.users.map(user => user.roles.name))];
      setRoles(uniqueRoles);
    });
  }, []);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole ? user.roles.name === selectedRole : true;
    const matchesSearch = searchTerm ? (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.manager?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    ) : true;
    return matchesRole && matchesSearch;
  });

  const toggleDropdown = (id) => {
    document.getElementById(`dropdown-${id}`).classList.toggle('show');
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>RETISS</h1>
        </div>
        <ul className="sidebar-menu">
          <li className="sidebar-item active"><i className="icon-users"></i>Users</li>
          <li className="sidebar-item"><i className="icon-roles"></i>Roles</li>
          <li className="sidebar-item"><i className="icon-sites"></i>Sites</li>
          <li className="sidebar-item"><i className="icon-alerts"></i>Alerts</li>
        </ul>
      </div>
      <div className="content">
        <div className="users-container">
          <h1 className="users-title">Users</h1>
          <div className="filter-container">
            <label className="filter-label">Filter by Role: </label>
            <select className="filter-select" value={selectedRole} onChange={handleRoleChange}>
              <option value=''>All</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="search-container">
            <label className="search-label">Search: </label>
            <input
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users..."
            />
          </div>
          <button className="add-user-button">+ Add User</button>
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact (Email, Phone)</th>
                <th>Username</th>
                <th>Reporting To</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}<br />{user.phone}</td>
                  <td>{user.username}</td>
                  <td>{user.manager?.name}</td>
                  <td>{user.roles.name}</td>
                  <td className="actions">
                    <div className="dropdown">
                      <button className="dropbtn" onClick={() => toggleDropdown(user.id)}>⋮</button>
                      <div id={`dropdown-${user.id}`} className="dropdown-content">
                        <button onClick={() => alert('Update user')}>Update</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button>Previous</button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
