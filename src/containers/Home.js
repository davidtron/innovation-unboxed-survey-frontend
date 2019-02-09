import React, {Component} from "react";
import {Media} from "reactstrap";
import "./Home.css";
import PercentageCircle from '../components/PercentageCircle';
import Error from "../components/Error";


import {createAudit, getInProgressAudits, getUnstartedAudits} from "../lib/AuditData";

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
        this.setState({isLoading: true, error: null});

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
            <Media list className="audits pl-0 pb-sm-3">
                <h3>Start a new audit</h3>
                <div className="mb-2">These are new audits that you can choose to start.</div>

                    {unstartedAudits.map(
                        (audit, i) =>
                            <Media className="mb-3 hoverable" href="#" onClick={() => this.createNewAudit(audit)} key={i}>
                                <Media className="align-self-center mr-sm-4 mr-1" >
                                    <PercentageCircle
                                        radius={40}
                                        borderWidth={8}
                                        bgcolor="#ffc107">
                                        <span className="display-4 text" aria-hidden>{"\uFF0B"}</span>
                                    </PercentageCircle>
                                </Media>
                                <Media body>
                                    <Media heading>{audit.title}</Media>
                                    <div>{audit.description}</div>
                                </Media>
                            </Media>
                    )}
            </Media>
        );
    }


    renderInProgressAudits() {
        const inProgressAudits = this.state.inProgressAudits;
        if (inProgressAudits.length === 0) {
            return <div/>;
        }

        return (
            <Media list className="audits pl-0">
                <h3>Your existing audits</h3>
                <div className="mb-2">These are audits that are in progress or ones you have completed with the advice we provide.</div>
                    {inProgressAudits.map(
                        (audit, i) =>
                            <Media className="mb-3 hoverable" href={`/audits/${audit.auditAnswersId}`}  key={i}>
                                <Media className="align-self-center mr-sm-4 mr-1" >
                                    <PercentageCircle
                                        radius={40}
                                        borderWidth={8}
                                        percent={audit.percentageComplete}
                                        color="#007bff">
                                    </PercentageCircle>
                                </Media>
                                <Media body>
                                    <Media heading>{audit.title}</Media>
                                    <div>{audit.description}</div>
                                    <small className="text-muted">{"Updated " + new Date(audit.lastEditTime).toLocaleDateString()}</small>
                                </Media>
                            </Media>
                    )}

            </Media>);
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
            return <div>Loading...</div>
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
                <Error error={this.state.error} />
                {this.props.isAuthenticated ? this.renderAudits() : this.renderLander()}
            </div>
        );
    }
}