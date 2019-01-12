import React, {Component} from "react";
import {API} from "aws-amplify";
import Page from "../audit/containers/Page";
import Advice from "../audit/containers/Advice";
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

        //const {audit, currentPage, auditAnswers} = props;

        this.state = {
            audit: null,
            currentPage: null,
            auditAnswers: null,
            complete: false
        };

    }

    async componentDidMount() {
        // TODO: Make this load if its not passed through via props?
        // At the moment it loads first time and we dont pass through props

        try {
            const auditData = await this.getAudit();

            console.log("Loaded", auditData);
            const {auditAnswers, currentPage, complete} = auditData;

            const audit = lookupById(auditData.auditId);

            this.setState({
                audit: audit,
                currentPage: currentPage,
                auditAnswers: JSON.parse(auditAnswers),
                complete: complete,
            });
        } catch (e) {
            alert(e);
        }
    }

    getAudit() {
        return API.get("audits", `/audits/${this.props.match.params.id}`);
    }

    toggleCompletedStateOfAudit = answersSubmitted => {
        console.log("Setting completed state to " + !this.state.complete);
        let saved = this.saveSubmittedAnswers(answersSubmitted, this.state.currentPage, !this.state.complete);

        // TODO: display advice or go back to the
        saved.then(() => this.setState({complete: !this.state.complete}))
            .catch(error => alert(error));
    };

    previousPage = answersSubmitted => {
        console.log("Prev page pressed");
        let pageNumber = this.state.currentPage - 1;
        console.log("Prev page pressed, new pagenumber is ", pageNumber);

        let saved = this.saveSubmittedAnswers(answersSubmitted, pageNumber, this.state.complete);

        saved.then(() => this.setState({currentPage: pageNumber}))
            .catch(error => alert(error));
    };

    nextPage = answersSubmitted => {
        console.log("Next page pressed");

        let pageNumber = this.state.currentPage + 1;
        let saved = this.saveSubmittedAnswers(answersSubmitted, pageNumber, this.state.complete);
        saved.then(() => this.setState({currentPage: pageNumber}))
            .catch(error => alert(error));

    };


    saveSubmittedAnswers = async (answersSubmitted, page, complete) => {
        console.log("Answer submitted ", answersSubmitted);
        console.log("current page is ", page);

        const updatedAnswers = update(this.state.auditAnswers, {[answersSubmitted.pageId]: {$set: answersSubmitted.answers}});
        this.setState({auditAnswers: updatedAnswers});

        // todo set page here instead?

        let toSave = {
            currentPage: page,
            auditAnswers: JSON.stringify(updatedAnswers),
            complete: complete
        };

        console.log("saving ", toSave);

        return await API.put("audits", `/audits/${this.props.match.params.id}`, {
            body: toSave
        });
    };


    render() {
        if (!this.state.auditAnswers) return <div>Loading...</div>;

        const totalPages = this.state.audit.pages.length;
        const currentPage = this.state.currentPage;

        let prevPageFunction = currentPage - 1 >= 0 ? this.previousPage : null;
        let nextPageFunction = currentPage + 1 < totalPages ? this.nextPage : null;
        let viewAdviceFunction = currentPage + 1 >= totalPages ? this.toggleCompletedStateOfAudit : null;


        let pageData = this.state.audit.pages[currentPage];
        let answers = this.state.auditAnswers[pageData.pageId];

        // TODO - this only passes through answers for the current page
        // We also need to pass through either a callback or the audit id
        if(this.state.complete && viewAdviceFunction) {
            console.log("Using answers : ", answers);

            // Go to the advice

            // Need to pass through reference to save answers
            return <Advice key={pageData.pageId} auditAnswers={this.state.auditAnswers} audit={this.state.audit} edit={viewAdviceFunction}></Advice>
        }

        console.log("rendering page ", currentPage);

        return (
            <Container>
                <Page key={pageData.pageId} answers={answers} pageData={pageData}
                      previous={prevPageFunction}
                      next={nextPageFunction}
                      quit={viewAdviceFunction}/>

                <Progress value={((currentPage + 1) / totalPages * 100)}>Page {currentPage + 1}</Progress>
            </Container>
        );
    }
}