import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Container, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Collapse} from "reactstrap";
import "./App.css";
import Routes from "./Routes";

class App extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <Container className="App">
                <Navbar color="light" light expand="md">
                    <NavbarBrand tag={Link} to="/">Innovation Unboxed survey</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to="/signup">Signup</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/login">Login</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
                <Routes/>
            </Container>
        );
    }
}

export default App;