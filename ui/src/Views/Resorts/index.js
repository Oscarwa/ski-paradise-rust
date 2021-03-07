import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import SkiModal from "../../Components/SkiModal";

export default function Resorts() {
  const [resorts, setResorts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState();
  const [actions, setActions] = useState([]);
  const baseUrl = "http://localhost:8080/api/resorts";

  const loadResorts = async () => {
    const data = await callApi(baseUrl);
    setResorts(data);
  };

  const callApi = async (url, options) => {
    const result = await fetch(url, options);
    const data = await result.json();
    console.log(data);
    return data;
  };

  useEffect(() => {
    loadResorts();
  }, []);

  const edit = async () => {
    const res = await callApi(`${baseUrl}/${selected._id["$oid"]}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
        headers: {
            'Content-Type': 'application/json',
        }
      });
      if (res) {
        console.log("updated", selected);
        const updatedResort = resorts.map(r => {
              if(r._id["$oid"] === selected._id["$oid"])
              {
                  r.name = name;
              }
              return r;
          }
        );
        setResorts(updatedResort);
        cancel();
      }
      setSelected(null);
  }

  const cancel = () => {
      setSelected(null);
      setEditMode(false);
      setName('');
  }

  const add = async () => {
    if (name) {
      const res = await callApi(baseUrl, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
            'Content-Type': 'application/json',
        }
      });
      if (res) {
        console.log("Added");
        const _resorts = [{_id: res, name}, ...resorts];
        setResorts(_resorts);
        cancel();
      }
    }
  };

  const startEdit = (resort) => {
    setEditMode(true);
    setName(resort.name);
    setSelected(resort);
  };

  const remove = (resort) => {
    setDeleteModalShow(true);
    setSelected(resort);
    const actions = [
      {
        handler: () => {
          console.log("canceled remove");
          setDeleteModalShow(false);
          cancel();
        },
        label: "Cancel",
        type: "secondary",
      },
      {
        handler: () => {
          const res = callApi(`${baseUrl}/${resort._id["$oid"]}`, {
            method: "DELETE",
          });
          if (res) {
            console.log("removed", resort);
            const newResorts = resorts.filter(
              (r) => r._id["$oid"] !== resort._id["$oid"]
            );
            setResorts(newResorts);
          }
          setDeleteModalShow(false);
          cancel();
        },
        label: "Delete",
        type: "danger",
      },
    ];
    setActions(actions);
  };

  return (
    <div>
      <h1>Resorts</h1>
      <hr />
      <section className="container">
        <div className="actions">
          <Row>
            <Col sm={7}>
              <Form.Control
                type="text"
                placeholder="Enter resort's name"
                value={name}
                onChange={(e) => {
                  let _name = name;
                  _name = e.target.value;
                  setName(_name);
                }}
              />
            </Col>
            <Col>
              { !editMode
                ? <Button onClick={add}>Add</Button>
                : <Button variant='success' onClick={edit}>Update</Button>
              }
              <Button variant='secondary' onClick={cancel}>Cancel</Button>
            </Col>
          </Row>
        </div>
        <hr />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resorts.map((r) => {
              return (
                <tr key={r._id["$oid"]}>
                  <td>{r.name}</td>
                  <td className="actions">
                    <Button onClick={() => startEdit(r)} variant="dark">
                      Edit
                    </Button>
                    <Button onClick={() => remove(r)} variant="dark">
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </section>
      
      <SkiModal
        show={deleteModalShow}
        title={"Delete resort"}
        onHide={() => setDeleteModalShow(false)}
        actions={actions}
      >
        Are you sure you want to remove '{selected ? selected.name : null}'?
      </SkiModal>
    </div>
  );
}
