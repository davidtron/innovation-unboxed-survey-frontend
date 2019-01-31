import React, {Component} from "react";
import {ListGroup, ListGroupItem} from "reactstrap";
import "./Home.css";
import {Link} from "react-router-dom";

import {createAudit, getUnstartedAudits, getInProgressAudits} from "../lib/AuditData";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            unstartedAudits: [],
            inProgressAudits: [],
            error: null
        };
    }

    async componentDidMount() {

        // Disable when working on train
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const unstartedAudits = await getUnstartedAudits();
            const inProgressAudits = await getInProgressAudits();

            this.setState({
                inProgressAudits: inProgressAudits,
                unstartedAudits: unstartedAudits,
                error: null
            });
        } catch (e) {
            this.setState({error: e.message});
            console.error("Could not mount audit Home",e);
        }

        this.setState({isLoading: false});
    }


    async createNewAudit(audit) {
        this.setState({isLoading: true});

        try {
            const newAudit = await createAudit(audit.auditId);
            // Now route to audit
            this.props.history.push(`/audits/${newAudit.auditAnswersId}`);

        } catch (e) {
            this.setState({error: e.message});
            console.error("Could not create new audit",e);
        }

        this.setState({isLoading: false});
    }

    renderUnstartedAudits() {
        const unstartedAudits = this.state.unstartedAudits;
        if (unstartedAudits.length === 0) {
            return <div/>;
        }

        return (
            <div>
                <h2>Start a new audit</h2>
                <ListGroup>
                    {unstartedAudits.map(
                        (audit, i) => <ListGroupItem tag="button" action
                                                     onClick={() => this.createNewAudit(audit)}
                                                     key={i}>
                            <h4>
                                <b>{"\uFF0B"}</b>Start: {audit.title}
                            </h4>
                            {audit.description}
                        </ListGroupItem>
                    )}
                </ListGroup>
            </div>
        );
    }


    renderInProgressAudits() {
        const inProgressAudits = this.state.inProgressAudits;
        if (inProgressAudits.length === 0) {
            return <div/>;
        }

        return (
            <div className="audits">
                <h2>Your existing audits</h2>
                <ListGroup>
                    {inProgressAudits.map(
                        (audit, i) => <ListGroupItem tag={Link} to={`/audits/${audit.auditAnswersId}`} header="Foo" key={i}>
                                    <h4>
                                        {audit.title}
                                    </h4>
                                    {audit.description}
                                    <p>
                                        {"Updated " + new Date(audit.lastEditTime).toLocaleDateString() + " - audit is " + audit.percentageComplete + "% complete"}
                                    </p>
                                </ListGroupItem>
                    )}
                </ListGroup>
            </div>);
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
        if (this.state.isLoading) {
            return <div>Loading</div>
        }

        return (
            <div>
                {this.renderUnstartedAudits()}
                {this.renderInProgressAudits()}
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                <div>{this.state.error}</div>
                {this.props.isAuthenticated ? this.renderAudits() : this.renderLander()}
            </div>
        );
    }
}