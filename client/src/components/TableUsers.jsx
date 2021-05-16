import React from 'react';
import { Table, Button } from 'react-bootstrap';
import './TableUsers.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const TableUsers = () => {
    
    // Currently hard-coded users here, need to load users from mysql database instead
    const users = [
        {firstName: "Test", lastName: "User", email: "test@user.com", userType: "Admin"},
        {firstName: "Ad", lastName: "Min", email: "ad@min.com", userType: "Admin"},
        {firstName: "Tech", lastName: "Nician", email: "tech@nician.com", userType: "Technician"},
        {firstName: "Council", lastName: "Member", email: "council@member.com", userType: "Council Member"}
    ]

    const renderUser = (user, index) => {
        return (
            <tr key={index}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td>
                    <Button id="edit-button" variant="outline-primary">Edit</Button>{" "}
                    <Button id="del-button" variant="outline-danger">Del</Button>
                </td>
            </tr>
        )
    }

    return (
    <div className="userTablePage">
        <h1>Manage Users:</h1>
        <Table className="user-table" striped bordered responsive hover>
        <thead>
            <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email Address</th>
                <th scope="col">User Type</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            {users.map(renderUser)}
        </tbody>
        </Table>
    </div>
    );
}

export default TableUsers;