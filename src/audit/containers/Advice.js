import React, {Component} from 'react';

import {Button, Container, FormGroup, ButtonGroup} from 'reactstrap';
import {generateAdvice, findPageById} from '../../lib/AdviceData';
import {Link} from "react-router-dom";
import Paragraphs from '../components/Paragraphs';
import Error from '../../components/Error';

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
                <Error error={this.state.error} />
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

        return <Container>
            <Error error={this.state.error} />
            <h2>{auditPage.title}</h2>
            <p>{auditPage.description}</p>
            <FormGroup inline row>
                <ButtonGroup sm={{offset: 0}}>
                    {this.state.page - 1 >= 0 ? <Button onClick={this.previous}>Previous</Button> : null}

                    {this.state.page + 1 < advicePages.length ? <Button onClick={this.next}>Next</Button> :
                        <Button color="warning" tag={Link} to={`/`}>Close Advice</Button>
                    }

                    <Button color="danger" onClick={this.edit}>Edit my answers</Button>
                </ButtonGroup>
            </FormGroup>
            <h3>{advicePageData.score}</h3>
            <Paragraphs input={advicePageData.result} />
        </Container>
    }
}