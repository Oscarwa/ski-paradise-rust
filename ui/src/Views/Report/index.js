import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { apiCall } from "../../Utils/api";

export default function Report() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
      const result = await apiCall('/users');
      setUsers(result);
  }

  useEffect(() => {
      loadUsers();
  }, [])

  return (
    <div>
      <hr />
      <div className="container">
        <h1>Users report</h1>
        <hr />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Favorite resort</th>
            </tr>
          </thead>
          <tbody>
            { users && users.map(u => {
                return (
                    <tr key={u._id['$oid']}>
                        <td>{u.first_name}</td>
                        <td>{u.last_name}</td>
                        <td>{u.email}</td>
                        <td>{u.fav_resort}</td>
                    </tr>
                );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
