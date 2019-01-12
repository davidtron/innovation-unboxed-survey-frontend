import React, {Component} from 'react';

import RadioAnswers from '../components/RadioAnswers'
import TextAreaAnswer from '../components/TextAreaAnswer'
import TextBoxAnswer from '../components/TextBoxAnswer'
import {Button, Form, FormGroup, Container, ButtonGroup} from 'reactstrap';
import update from 'immutability-helper';
import {API} from "aws-amplify/lib/index";


export default class Advice extends Component {
    constructor(allprops) {
        super(allprops);

        const {audit, auditAnswers, edit, ...props} = allprops;
        this.audit = audit;
        this.edit = edit;

        this.state = {
            auditAnswers: auditAnswers
        };
    }

    editAnswers = event => {
      // set current page on the answers to page 0 (but leave complete as true)
        let toSave = {
            currentPage: 0,
            auditAnswers: JSON.stringify(this.state.auditAnswers),
            complete: true
        };


        console.log("saving");
        console.log(toSave);

        let result = API.put("audits", `/audits/${this.audit.auditId}`, {
            body: toSave
        });

        console.log(result);


        // How should we trigger parent refresh?

    };

    render() {
        // Next page through the audit results until final page
        console.log(this.state.auditAnswers);

        return <div>
            show the advice here
            <Button onClick={this.edit}>Edit my answers</Button>
        </div>
    }
}