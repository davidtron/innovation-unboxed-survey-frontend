import React, {Component, Fragment } from "react";
import {Link} from "react-router-dom";
import {Container, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Collapse} from "reactstrap";
import "./App.css";
import Routes from "./Routes";

class App extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            isAuthenticated: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    };

    handleLogout = event => {
        this.userHasAuthenticated(false);
    };


    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            <Container className="App">
                <Navbar color="light" light expand="md">
                    <NavbarBrand tag={Link} to="/">Innovation Unboxed survey</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {this.state.isAuthenticated
                                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                : <Fragment>
                                    <NavItem>
                                        <NavLink tag={Link} to="/signup">Signup</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} to="/login">Login</NavLink>
                                    </NavItem>
                                </Fragment>
                            }
                        </Nav>
                    </Collapse>
                </Navbar>
                <Routes childProps={childProps} />
            </Container>
        );
    }
}

export default App;