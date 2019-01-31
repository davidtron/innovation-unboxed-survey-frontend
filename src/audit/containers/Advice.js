import React, {Component} from 'react';

import RadioAnswers from '../components/RadioAnswers'
import TextAreaAnswer from '../components/TextAreaAnswer'
import TextBoxAnswer from '../components/TextBoxAnswer'
import {Button, Form, FormGroup, Container, ButtonGroup} from 'reactstrap';
import update from 'immutability-helper';
import {API} from "aws-amplify/lib/index";
import {generateAdvice, findPageById} from '../../lib/AdviceOnAudits';
import {Link} from "react-router-dom";


export default class Advice extends Component {
    constructor(allprops) {
        super(allprops);

        const {audit, auditAnswers, edit, ...props} = allprops;
        this.audit = audit;

        this.edit = edit;

        let advice = generateAdvice(audit, auditAnswers);

        this.state = {
            auditAnswers: auditAnswers,
            advice: advice,
            page: 0
        };
    }

    next = () => {
        this.setState({page: this.state.page +1});
    };

    previous = () => {
        this.setState({page: this.state.page - 1});
    };

    render() {
        // Go through each audit page and see if we have an advice for it and render

        const advicePages = Object.keys(this.state.advice);

        // console.log("All advice is ", this.state.advice);


        const pageId = advicePages[this.state.page];
        const advicePageData = this.state.advice[pageId];
        // console.log("Rendering advice page "+ this.state.page + " which is " + pageId, advicePageData);
        // console.log("Audit, ",this.audit);

        let auditPage = findPageById(this.audit, pageId);

        if(! auditPage) {
            // Last page (ie the summary)
            auditPage = {
                title: this.audit.title,
                description: this.audit.description
            };
        }

        const nextLink = this.state.page+1 < advicePages.length ? <Button onClick={this.next}>Next</Button>: <Button tag={Link} to={`/`}>Close Advice</Button>;;
        const prevLink = this.state.page-1 >= 0 ? <Button onClick={this.previous}>Previous</Button> : null;


        return <Container>

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