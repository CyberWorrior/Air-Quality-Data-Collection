import React from 'react'
import { Button } from 'react-bootstrap'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import {faRssSquare,faHome} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Header() {
    return (
        <Navbar collapseOnSelect style={{zIndex:5}} className="parent" collapseOnSelect expand="lg" bg="dark" variant="dark">
            <div className="container">
                <Navbar.Brand as={NavLink} to="/" className="brandName">Education</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={NavLink} to="/">Home <FontAwesomeIcon size="xs" icon={faHome}></FontAwesomeIcon></Nav.Link>
                        <Nav.Link as={NavLink} to="/">Feed <FontAwesomeIcon size="xs" icon={faRssSquare}></FontAwesomeIcon></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default Header
