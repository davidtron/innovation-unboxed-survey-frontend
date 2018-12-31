import React, {Component} from "react";
import {API} from "aws-amplify";
import Page from "../audit/containers/Page";
import {Container, Progress} from 'reactstrap';
import update from "immutability-helper/index";

import {lookupById} from "../lib/CreateAudits";


export default class Audit extends Component {
    constructor(props) {
        super(props);

        /*
            TODO: If this is a new audit we could pass in data via props,
            otherwise we could read from aws if its not passed in, inside componentDidMount.
            otherwise remove the props destructuring
         */

        const {audit, currentPage, auditAnswers} = props;

        this.state = {
            audit: audit,
            currentPage: currentPage,
            auditAnswers: auditAnswers
        };

    }

    async componentDidMount() {
        // TODO: Make this load if its not passed through via props?

        try {
            const auditData = await this.getAudit();

            console.log("Loaded", auditData);
            const {auditAnswers, currentPage} = auditData;

            const audit = lookupById(auditData.auditId);

            this.setState({
                audit: audit,
                currentPage: currentPage,
                auditAnswers: JSON.parse(auditAnswers)
            });
        } catch (e) {
            alert(e);
        }
    }

    getAudit() {
        return API.get("audits", `/audits/${this.props.match.params.id}`);
    }

    quitPage = answersSubmitted => {
        console.log("Complete page pressed");
        let saved = this.saveSubmittedAnswers(answersSubmitted, this.state.currentPage);

        // TODO: display advice or go back to the
        // saved.then(() => this.setState({currentPage: pageNumber}))
        //     .catch(error => alert(error));
    };

    previousPage = answersSubmitted => {
        console.log("Prev page pressed");
        let pageNumber = this.state.currentPage - 1;

        let saved = this.saveSubmittedAnswers(answersSubmitted, pageNumber);

        saved.then(() => this.setState({currentPage: pageNumber}))
            .catch(error => alert(error));
    };

    nextPage = answersSubmitted => {
        console.log("Next page pressed");

        let pageNumber = this.state.currentPage + 1;
        let saved = this.saveSubmittedAnswers(answersSubmitted, pageNumber);
        saved.then(() => this.setState({currentPage: pageNumber}))
            .catch(error => alert(error));

    };


    saveSubmittedAnswers = async (answersSubmitted, page) => {
        console.log("Answer submitted ", answersSubmitted);


        // TODO: deactivate pre/next buttons if isLoading
        this.setState({isLoading: true});

        const updatedAnswers = update(this.state.auditAnswers, {[answersSubmitted.pageId]: {$set: answersSubmitted.answers}});
        this.setState({auditAnswers: updatedAnswers});


        let toSave = {
            currentPage: page,
            auditAnswers: JSON.stringify(updatedAnswers)
        };

        return await API.put("audits", `/audits/${this.props.match.params.id}`, {
            body: toSave
        });
    };


    render() {

        if (!this.state.auditAnswers) return <div>Loading...</div>;
        console.log(this.state);


        const totalPages = this.state.audit.pages.length;
        const currentPage = this.state.currentPage;

        let prevPageFunction = currentPage - 1 >= 0 ? this.previousPage : null;
        let nextPageFunction = currentPage + 1 < totalPages ? this.nextPage : null;
        let quitPageFunction = currentPage + 1 >= totalPages ? this.quitPage : null;

        let pageData = this.state.audit.pages[currentPage];
        let answers = this.state.auditAnswers[pageData.pageId];

        console.log("Current page is ", currentPage);
        console.log("Using answers : ", answers);

        return (
            <Container>
                <Page key={pageData.pageId} answers={answers} pageData={pageData}
                      previous={prevPageFunction}
                      next={nextPageFunction}
                      quit={quitPageFunction}/>

                <Progress value={((currentPage + 1) / totalPages * 100)}>Page {currentPage + 1}</Progress>
            </Container>
        );
    }
}