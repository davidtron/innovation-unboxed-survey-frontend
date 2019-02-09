import React, {Component} from "react";
import Page from "../audit/containers/Page";
import Advice from "../audit/containers/Advice";
import {Container, Progress} from 'reactstrap';
import update from "immutability-helper/index";

import {lookupById} from "../lib/AuditData";
import {updateAudit, loadAuditById} from "../lib/DataLoader";

/**
 * Handles loading audit data and displaying either the questions or the advice
 */
export default class Audit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            audit: null,
            currentPage: null,
            auditAnswers: null,
            complete: false,
            error: null
        };
    }

    async componentDidMount() {
        try {
            const auditData = await loadAuditById(this.props.match.params.id);
            const {auditAnswers, currentPage, complete} = auditData;
            const audit = await lookupById(auditData.auditId);

            this.setState({
                audit: audit,
                currentPage: currentPage,
                auditAnswers: JSON.parse(auditAnswers),
                complete: complete,
                error: null
            });
        } catch (e) {
            this.handleError(e);
        }
    }

    handleError(e) {
        this.setState({error: e.message});
        console.error("Could not render Audit", e);
    }

    toggleCompletedStateOfAudit = answersSubmitted => {
        console.log("Setting completed state to " + !this.state.complete);
        let saved = this.saveSubmittedAnswers(answersSubmitted, this.state.currentPage, !this.state.complete);

        saved.then(() => this.setState({complete: !this.state.complete}))
            .catch(error => this.handleError(error));
    };

    previousPage = answersSubmitted => {
        let pageNumber = this.state.currentPage - 1;
        // console.log("Prev page pressed, new pagenumber is ", pageNumber);

        let saved = this.saveSubmittedAnswers(answersSubmitted, pageNumber, this.state.complete);

        saved.then(() => this.setState({currentPage: pageNumber}))
            .catch(error => this.handleError(error));
    };

    nextPage = answersSubmitted => {
        let pageNumber = this.state.currentPage + 1;
        // console.log("Next page pressed, new pagenumber is ", pageNumber);

        let saved = this.saveSubmittedAnswers(answersSubmitted, pageNumber, this.state.complete);
        saved.then(() => this.setState({currentPage: pageNumber}))
            .catch(error => this.handleError(error));

    };


    saveSubmittedAnswers = async (answersSubmitted, page, complete) => {
        // console.log("Answer submitted ", answersSubmitted);
        // console.log("current page is ", page);

        const updatedAnswers = update(this.state.auditAnswers, {[answersSubmitted.pageId]: {$set: answersSubmitted.answers}});
        this.setState({auditAnswers: updatedAnswers});

        let toSave = {
            currentPage: page,
            auditAnswers: JSON.stringify(updatedAnswers),
            complete: complete
        };

        return await updateAudit(this.props.match.params.id, toSave);
    };


    render() {
        if (!this.state.auditAnswers) return <div>Loading...</div>;

        const totalPages = this.state.audit.pages.length;
        const currentPage = this.state.currentPage;
        const pageData = this.state.audit.pages[currentPage];

        let prevPageFunction = currentPage - 1 >= 0 ? this.previousPage : null;
        let nextPageFunction = currentPage + 1 < totalPages ? this.nextPage : null;
        let viewAdviceFunction = currentPage + 1 >= totalPages ? this.toggleCompletedStateOfAudit : null;

        if(this.state.complete && viewAdviceFunction) {
            return <Advice key={pageData.pageId} auditAnswers={this.state.auditAnswers} audit={this.state.audit}
                           edit={viewAdviceFunction}
            />
        }

        let answers = this.state.auditAnswers[pageData.pageId];

        return (
            <Container>
                <div>{this.state.error}</div>
                <Page key={pageData.pageId} answers={answers} pageData={pageData}
                      previous={prevPageFunction}
                      next={nextPageFunction}
                      quit={viewAdviceFunction}/>

                <Progress value={((currentPage + 1) / totalPages * 100)}>Page {currentPage + 1}</Progress>
            </Container>
        );
    }
}