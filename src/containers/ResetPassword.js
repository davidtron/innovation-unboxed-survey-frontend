import React, {Component} from "react";
import {Auth} from "aws-amplify";
import {Link} from "react-router-dom";
import {Form, FormGroup, FormText, Input, Label} from "reactstrap";
import LoaderButton from "../components/LoaderButton";
import Error from "../components/Error";
import "./ResetPassword.css";
import { TiTick } from 'react-icons/ti';


export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: "",
            email: "",
            password: "",
            codeSent: false,
            confirmed: false,
            confirmPassword: "",
            isConfirming: false,
            isSendingCode: false,
            error: null
        };
    }

    validateCodeForm() {
        return this.state.email.length > 0;
    }

    validateResetForm() {
        return (
            this.state.code.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSendCodeClick = async event => {
        event.preventDefault();

        this.setState({isSendingCode: true, error: null});

        try {
            await Auth.forgotPassword(this.state.email);
            this.setState({codeSent: true});
        } catch (e) {
            console.error("Could not send forgotten password code",e.message);
            this.setState({isSendingCode: false, error: e.message});
        }
    };

    handleConfirmClick = async event => {
        event.preventDefault();

        this.setState({isConfirming: true, error: null});

        try {
            await Auth.forgotPasswordSubmit(
                this.state.email,
                this.state.code,
                this.state.password
            );
            this.setState({confirmed: true});
        } catch (e) {
            console.error("Could not submit forgotten password",e.message);
            this.setState({isConfirming: false, error: e.message});
        }
    };

    renderRequestCodeForm() {
        return (
            <Form className="mt-5" onSubmit={this.handleSendCodeClick}>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        autoFocus
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    loadingText="Sending..."
                    text="Send Confirmation"
                    isLoading={this.state.isSendingCode}
                    disabled={!this.validateCodeForm()}
                />
            </Form>
        );
    }

    renderConfirmationForm() {
        return (
            <Form className="mt-5" onSubmit={this.handleConfirmClick}>
                <FormGroup>
                    <Label for="code">Confirmation Code</Label>
                    <Input
                        id="code"
                        name="code"
                        autoFocus
                        type="tel"
                        value={this.state.code}
                        onChange={this.handleChange}
                    />
                    <FormText>
                        Please check your email ({this.state.email}) for the confirmation
                        code.
                    </FormText>
                </FormGroup>
                <hr/>
                <FormGroup>
                    <Label for="password">New Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        onChange={this.handleChange}
                        value={this.state.confirmPassword}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    text="Confirm"
                    loadingText="Confirm..."
                    isLoading={this.state.isConfirming}
                    disabled={!this.validateResetForm()}
                />
            </Form>
        );
    }

    renderSuccessMessage() {
        return (
            <div className="success mt-5">
                <TiTick size="1.8em"/>
                <p>Your password has been reset.</p>
                <p>
                    <Link to="/login">
                        Click here to login with your new credentials.
                    </Link>
                </p>
            </div>
        );
    }

    render() {
        return (
            <div className="ResetPassword">
                <Error error={this.state.error} />
                {!this.state.codeSent
                    ? this.renderRequestCodeForm()
                    : !this.state.confirmed
                        ? this.renderConfirmationForm()
                        : this.renderSuccessMessage()}
            </div>
        );
    }
}