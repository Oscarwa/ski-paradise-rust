import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { withRouter } from "react-router";
import { apiCall } from "../../Utils/api";
import { SkiContext } from "../../Utils/context";

function UserRegistration(props) {
  const { setUser } = useContext(SkiContext);
  const [validated, setValidated] = useState(false);
  const [resorts, setResorts] = useState([]);

  const loadResorts = async () => {
    const result = await apiCall("/resorts");
    setResorts(result);
  };

  useEffect(() => {
    loadResorts();
  }, []);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() === false) {
      return;
    }
    const newUser = {
      first_name: form.elements["first_name"].value,
      last_name: form.elements["last_name"].value,
      email: form.elements["email"].value,
      fav_resort: form.elements[3].value,
    };
    const result = await apiCall("/users", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result) {
      setUser({ _id: result, ...newUser });
      props.history.push("/thank-you");
    }
  };
  return (
    <div>
      <hr />
      <section className="container">
        <h1>Newsletter</h1>
        <h4>
          Sign up to our Newsletter to receive expert-curated
          deals, trip guides and snow news.
        </h4>
        <hr />
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="formFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                required
                placeholder="First name"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                required
                placeholder="Last name"
              />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              required
              placeholder="Email"
            />
            <Form.Control.Feedback type="invalid">
              Please enter your email.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label className="my-1 mr-2" htmlFor="fav_resort">
              Favorite resort
            </Form.Label>
            <Form.Control
              as="select"
              required
              custom
              name="fav_resort"
              controlId="formFavResort"
            >
              <option value={null} disabled>
                Choose one...
              </option>
              {resorts &&
                resorts.map((r) => (
                  <option key={r._id["$oid"]} value={r.name}>
                    {r.name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
          <div className="actions">
            <Button variant="primary" type="submit">
              Suscribe!
            </Button>
          </div>
        </Form>
      </section>
    </div>
  );
}

export default withRouter(UserRegistration);
