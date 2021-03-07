import { Button, Modal } from "react-bootstrap";

export default function SkiModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      {
        props.actions && 
        <Modal.Footer>
          {props.actions.map((a, index) => <Button key={index} variant={a.type || 'primary'} onClick={a.handler}>{a.label}</Button>)}
        </Modal.Footer>
      }
    </Modal>
  );
}
