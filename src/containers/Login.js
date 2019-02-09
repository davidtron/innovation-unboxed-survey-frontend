import React, {Component} from "react";
import {Form, FormGroup, Input, Label} from "reactstrap";
import "./Login.css";
import {Auth} from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import Error from "../components/Error"


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: "",
            error: null
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    };

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({isLoading: true, error: null});

        try {
            await Auth.signIn(this.state.email, this.state.password);
            this.props.userHasAuthenticated(true);
        } catch (e) {
            console.error(e.message);
            this.setState({isLoading: false, error: e.message});
        }
    };

    render() {
        return (
            <div className="Login">
                <Error error={this.state.error}/>
                <Form className="mt-5" onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            defaultValue={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            defaultValue={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Link to="/login/reset">Forgot password?</Link>

                    <LoaderButton
                        block
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Login"
                        loadingText="Logging in..."
                    />
                </Form>
            </div>
        );
    }
}