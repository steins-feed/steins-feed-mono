"use client"

import { useRouter } from "next/navigation"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import FormControl from "react-bootstrap/FormControl"
import FormLabel from "react-bootstrap/FormLabel"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"

import { doLoginTokenPost } from "./actions"

export default function LoginModal() {
  const router = useRouter();

  let username: string | null = null;
  let password: string | null = null;

  async function handleSubmit() {
    await doLoginTokenPost(username!, password!);
    router.push("/");
  }

  return (
<Modal show={ true }>
<Modal.Header>
<Modal.Title>Log in</Modal.Title>
</Modal.Header>
<Modal.Body>
<Form>
  <Row>
    <FormLabel column htmlFor="username" xs={2}>User</FormLabel>
    <Col>
    <FormControl
      id="username"
      placeholder="Enter user name."
      onChange={ e => username = e.target.value }
    />
    </Col>
  </Row>

  <Row>
    <FormLabel column htmlFor="password" xs={2}>Password</FormLabel>
    <Col>
    <FormControl
      id="password"
      type="password"
      placeholder="Enter password."
      onChange={ e => password = e.target.value }
    />
    </Col>
  </Row>
</Form>
</Modal.Body>
<Modal.Footer>
<Button type="button" onClick={ handleSubmit }>Submit</Button>
</Modal.Footer>
</Modal>
  );
}