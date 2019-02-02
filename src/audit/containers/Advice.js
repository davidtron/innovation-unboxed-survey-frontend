import React, {Component} from 'react';

import {Button, Container} from 'reactstrap';
import {generateAdvice, findPageById} from '../../lib/AdviceData';
import {Link} from "react-router-dom";


export default class Advice extends Component {
    constructor(props) {
        super(props);

        const {audit, auditAnswers, edit} = props;
        this.audit = audit;
        this.edit = edit;

        this.state = {
            auditAnswers: auditAnswers,
            advice: null,
            page: 0,
            error: null
        };
    }

    async componentDidMount() {

        try {
            const advice = await generateAdvice(this.audit, this.state.auditAnswers);
            this.setState({
                advice: advice
            });
        } catch (e) {
            this.setState({error: e.message});
            console.error("Could not mount audit Advice", e);
        }
    }

    next = () => {
        this.setState({page: this.state.page + 1});
    };

    previous = () => {
        this.setState({page: this.state.page - 1});
    };

    render() {
        const advice = this.state.advice;

        if (!advice) {
            return <Container>
                <div>{this.state.error}</div>
                <div>Loading...</div>
            </Container>

        }

        // Go through each audit page and see if we have an advice for it and render
        const advicePages = Object.keys(this.state.advice);

        // console.log("All advice is ", this.state.advice);
        const pageId = advicePages[this.state.page];
        const advicePageData = this.state.advice[pageId];
        // console.log("Rendering advice page "+ this.state.page + " which is " + pageId, advicePageData);
        // console.log("Audit, ",this.audit);

        let auditPage = findPageById(this.audit, pageId);

        if (!auditPage) {
            // Last page (ie the summary)
            auditPage = {
                title: this.audit.title,
                description: this.audit.description
            };
        }

        const nextLink = this.state.page + 1 < advicePages.length ? <Button onClick={this.next}>Next</Button> :
            <Button tag={Link} to={`/`}>Close Advice</Button>;
        ;
        const prevLink = this.state.page - 1 >= 0 ? <Button onClick={this.previous}>Previous</Button> : null;

        return <Container>
            <div>{this.state.error}</div>
            <h2>{auditPage.title}</h2>
            <h3>{auditPage.description}</h3>
            <p>{advicePageData.score}</p>
            <p>{advicePageData.result}</p>

            {prevLink}
            {nextLink}

            <Button onClick={this.edit}>Edit my answers</Button>
        </Container>
    }
}