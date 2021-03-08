import React, { useContext } from "react";
import { Jumbotron } from "react-bootstrap";
import { SkiContext } from "../../Utils/context";

export default function ThankYou() {
  const { user } = useContext(SkiContext);
  return (
    <div className='container center'>
      {user ? <Jumbotron><h2>Thank you for suscribing, {user.first_name}!</h2></Jumbotron> : ''}
    </div>
  );
}
