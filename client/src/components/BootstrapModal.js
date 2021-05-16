import React from "react";
import { Button, Modal } from "react-bootstrap";

class BootstrapModal extends React.Component {
  constructor() {
    super();
    this.state = {
      showHide: false,
    };
  }

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide });
  }

  render() {
    return (
      <div>
        <Button variant="primary" onClick={() => this.handleModalShowHide()}>
          Launch demo modal
        </Button>

        <Modal
          className=".modal-dialog-centered"
          show={this.state.showHide}
          centered
        >
          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure tou want to delete user?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.handleModalShowHide()}
            >
              No
            </Button>
            <Button
              variant="primary"
              onClick={() => this.handleModalShowHide()}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default BootstrapModal;
