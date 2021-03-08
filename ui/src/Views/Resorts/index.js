import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import SkiModal from "../../Components/SkiModal";
import { apiCall } from "../../Utils/api";

export default function Resorts() {
  const [resorts, setResorts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState();
  const [actions, setActions] = useState([]);

  const loadResorts = async () => {
    const data = await apiCall('/resorts');
    setResorts(data);
  };

  useEffect(() => {
    loadResorts();
  }, []);

  const edit = async () => {
    const res = await apiCall(`/resorts/${selected._id["$oid"]}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res) {
      const updatedResort = resorts.map((r) => {
        if (r._id["$oid"] === selected._id["$oid"]) {
          r.name = name;
        }
        return r;
      });
      setResorts(updatedResort);
      cancel();
    }
    setSelected(null);
  };

  const cancel = () => {
    setSelected(null);
    setEditMode(false);
    setName("");
  };

  const add = async () => {
    if (name) {
      const res = await apiCall('/resorts', {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res) {
        const _resorts = [{ _id: res, name }, ...resorts];
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
          setDeleteModalShow(false);
          cancel();
        },
        label: "Cancel",
        type: "secondary",
      },
      {
        handler: () => {
          const res = apiCall(`/resorts/${resort._id["$oid"]}`, {
            method: "DELETE",
          });
          if (res) {
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
      <hr />
      <section className="container">
      <h1>Resorts</h1>
      <hr />
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
              {!editMode ? (
                <Button onClick={add}>Add</Button>
              ) : (
                <Button variant="success" onClick={edit}>
                  Update
                </Button>
              )}
              <Button variant="secondary" onClick={cancel}>
                Cancel
              </Button>
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
                  <td width="70%">{r.name}</td>
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
