import React, {Component} from 'react';

import {Media, Button, Container, FormGroup, ButtonGroup} from 'reactstrap';
import {generateAdvice, findPageById} from '../../lib/AdviceData';
import {Link} from "react-router-dom";
import Paragraphs from '../components/Paragraphs';
import Error from '../../components/Error';
import PercentageCircle from '../../components/PercentageCircle';

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

    renderScore = (score) => {
        if(! score) return;

        return <PercentageCircle
            radius={40}
            borderWidth={8}
            percent={Math.round(score)}
            color="#007bff">
        </PercentageCircle>
    };


    render() {
        const advice = this.state.advice;

        console.log("Render it");

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
        let advicePageData = this.state.advice[pageId];
        // console.log("Rendering advice page "+ this.state.page + " which is " + pageId, advicePageData);
        // console.log("Audit, ",this.audit);

        let auditPage = findPageById(this.audit, pageId);

        if (!auditPage) {
            // Last page (ie the summary)
            auditPage = {
                title: "Summary", //this.audit.title,
                description: this.audit.description
            };
        }

        return <Container>
            <Error error={this.state.error} />
            <h2>Advice for {this.audit.title}</h2>

            <Media className="mt-4" >
                <Media className="align-self-center mr-sm-4 mr-1" >
                    {this.renderScore(advicePageData.score)}
                </Media>
                <Media body>
                    <Media heading>{auditPage.title}</Media>
                    <div>{auditPage.description}</div>
                </Media>
            </Media>

            <Paragraphs input={advicePageData.result} />
            <FormGroup inline row>
                <ButtonGroup sm={{offset: 0}}>
                    {this.state.page - 1 >= 0 ? <Button onClick={this.previous}>Previous</Button> : null}

                    {this.state.page + 1 < advicePages.length ? <Button onClick={this.next}>Next</Button> :
                        <Button color="warning" tag={Link} to={`/`}>Close Advice</Button>
                    }

                    <Button color="danger" onClick={this.edit}>Edit my answers</Button>
                </ButtonGroup>
            </FormGroup>
        </Container>
    }
}