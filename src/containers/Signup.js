import React, {Component} from "react";
import {Form, FormGroup, FormText, Input, Label} from "reactstrap";
import LoaderButton from "../components/LoaderButton";
import Error from "../components/Error";
import "./Signup.css";
import { Auth } from "aws-amplify";

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null,
            error: null
        };
    }

    validateForm() {
        return (
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true, error: null });

        try {
            const newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password
            });
            this.setState({
                newUser
            });
        } catch (e) {
            // TODO - handle invalid username exception (UsernameExistsException)
            // TODO - handle password length, type violations
            console.error(e.message);
            this.setState({ isLoading: false, error: e.message });
        }

        this.setState({ isLoading: false });
    };

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true, error: null });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            await Auth.signIn(this.state.email, this.state.password);

            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            console.error("Could not signin to account", e.message);
            this.setState({ isLoading: false, error: e.message });
        }
    };

    renderConfirmationForm() {
        return (
            <Form className="mt-5" onSubmit={this.handleConfirmationSubmit}>
                <FormGroup>
                    <Label for="confirmationCode">Confirmation Code</Label>
                    <Input
                        id="confirmationCode"
                        name="confirmationCode"
                        autoFocus
                        type="tel"
                        defaultValue={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <FormText color="muted">
                        Please check your email for the code.
                    </FormText>
                </FormGroup>
                <LoaderButton
                    block
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Verify"
                    loadingText="Verifying..."
                />
            </Form>
        );
    }

    renderForm() {
        return (
            <Form className="mt-5" onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        autoFocus
                        type="email"
                        name="email"
                        id="email"
                        defaultValue={this.state.email}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        name="password"
                        id="password"
                        defaultValue={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input
                        name="confirmPassword"
                        id="confirmPassword"
                        defaultValue={this.state.confirmPassword}
                        onChange={this.handleChange}
                        type="password"
                    />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Register"
                    loadingText="Register account..."
                />
            </Form>
        );
    }

    render() {
        return (
            <div className="Signup">
                <Error error={this.state.error}/>
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }
}