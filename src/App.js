import React, {Component, Fragment } from "react";
import {Link, withRouter} from "react-router-dom";
import {Container, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Collapse} from "reactstrap";
import "./App.css";
import Routes from "./Routes";
import { Auth } from "aws-amplify";


export class App extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            navIsOpen: false,
            isAuthenticated: false,
            isAuthenticating: true,
            error: null
        };
    }

    async componentDidMount() {
        try {
            await Auth.currentSession();
            this.userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
                console.error(e);
                this.setState({ error: e.message });
            }
        }

        this.setState({ isAuthenticating: false, error: null});
    }

    toggle() {
        this.setState({
            navIsOpen: !this.state.navIsOpen
        });
    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    };

    handleLogout = async event => {
        await Auth.signOut();

        this.userHasAuthenticated(false);
        this.props.history.push("/login");
    };


    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            !this.state.isAuthenticating &&
            <Container className="App">
                <Navbar color="light" light expand="md">
                    <NavbarBrand tag={Link} to="/">Innovation Unboxed Audit</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.navIsOpen} navbar>
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
                <div>{this.state.error}</div>
                <Routes childProps={childProps} />
            </Container>
        );
    }
}

export default withRouter(App);
