import React, { useState, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'

export default function Resorts() {
    const [resorts, setResorts] = useState([]);

    const loadResorts = async () => {
        const result = await fetch('http://localhost:8080/api/resorts');
        const data = await result.json();
        console.log(data);
        setResorts(data);
    }

    useEffect(() => {
        loadResorts();
        // return () => {
        //     cleanup
        // }
    }, [])

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { resorts.map(r => {
                        return (
                            <tr key={r._id['$oid']}>
                                <td>{r.name}</td>
                                <td>
                                    <Button variant="dark">Edit</Button>
                                    <Button variant="dark">Delete</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                </Table>
        </div>
    )
}
