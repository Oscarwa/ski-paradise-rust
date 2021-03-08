import React from "react";
import { Button, Jumbotron } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <hr />
      <section className="container">
        <Jumbotron>
          <h1>PLANNING YOUR SKI VACATION?</h1>
          <p>
            Planning ski vacations to major ski resorts is what we've done for
            more than 40 years. We've seen them all and we've visited every
            lodge, hotel and condo we represent. We've also skied and
            snowboarded at these resorts and know which are the best ski resorts
            for beginners, intermediates and experts. We've also sampled the
            local, off-mountain flavors, including nightlife, dining and
            activities. We know ski resorts and we know ski trips!
          </p>
          <p>
            Last-minute reservations are no problem for us. If you're flexible,
            we'll have discounts and deals that are even better than our regular
            discounted rates for air, lodging, lift tickets, ski rentals and
            more.
          </p>
        </Jumbotron>
        <Button as={Link} to="/users">
          I want to suscribe to the Newsletter!
        </Button>
      </section>
    </div>
  );
}
