import React from 'react'
import { Button } from 'react-bootstrap'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import {faChartBar,faHome} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Header() {
    return (
        <Navbar collapseOnSelect style={{zIndex:5}} className="parent" collapseOnSelect expand="lg" bg="dark" variant="dark">
            <div className="container">
                <Navbar.Brand as={NavLink} to="/" className="brandName">AQI</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={NavLink} to="/">Home <FontAwesomeIcon size="xs" icon={faHome}></FontAwesomeIcon></Nav.Link>
                        <Nav.Link as={NavLink} to="/graphtest">Graph <FontAwesomeIcon size="xs" icon={faChartBar}></FontAwesomeIcon></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default Header
