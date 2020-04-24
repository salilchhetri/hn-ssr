import React from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import "./HeaderComponent.scss";

export default function HeaderComponent() {
    return (
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="light">
            <Navbar.Brand href="#home">
                <span>Y</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#top">top</Nav.Link>
                    <Nav.Link href="#new">new</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
