import React, { Component } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import "./Home.css";
import { API } from "aws-amplify";
import {Link} from "react-router-dom";

import { availableAudits, createAudit, auditListDataFor } from "../lib/CreateAudits";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            audits: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        // TODO: this loads when we select menu - do we want to do that if we already have state?
        // Possible optimisation
        try {
            const audits = await this.getUsersAudits();
            this.setState({ audits: audits });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    getUsersAudits() {
        return API.get("audits", "/audits");
    }


    async createNewAudit(audit) {
        this.setState({ isLoading: true });

        try {
            const newAudit = await createAudit(audit.auditId);
            // Now route to audit

        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    renderAvailableAudits(audits) {
        return availableAudits(audits).map(
            (audit,i) => <ListGroupItem tag="button" action onClick={() => this.createNewAudit(audit)} key={audit.auditId}>
                <h4>
                    <b>{"\uFF0B"}</b>Start: {audit.title}
                </h4>
                {audit.description}
            </ListGroupItem>
        );
    }


    renderUsersAudits(usersAudits) {
        console.log("------");
        console.log(usersAudits);

        return usersAudits.map(
            (audit, i) => {
                const userAudit = auditListDataFor(audit);
                return <ListGroupItem tag={Link} to={`/audits/${audit.auditAnswersId}`} header="Foo" key={i}>
                                <h4>
                                    {userAudit.title}
                                </h4>
                                {userAudit.description}
                             <p>
                            {"Updated " + new Date(userAudit.lastEditTime).toLocaleDateString() + " - audit is " + userAudit.percentageComplete +"% complete"}
                             </p>
                            </ListGroupItem>
            }
        );
    }

    /**
     * Shown if user is not logged in
     */
    renderLander() {
        return (
            <div className="lander">
                <h1>Innovation Unboxed Audit</h1>
                <p>Audit your organisation to help identify and track your technical needs.</p>
                <p>Please register an account, or sign in to complete an audit</p>
            </div>
        );
    }

    renderAudits() {

        return (
            <div>

                <h3>Start a new audit</h3>
                <ListGroup>
                    {!this.state.isLoading && this.renderAvailableAudits(this.state.audits)}
                </ListGroup>


                <div className="audits">
                    <h2>Your existing audits</h2>
                    <ListGroup>
                        {!this.state.isLoading && this.renderUsersAudits(this.state.audits)}
                    </ListGroup>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderAudits() : this.renderLander()}
            </div>
        );
    }
}