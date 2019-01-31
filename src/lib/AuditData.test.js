import API from "aws-amplify";
import { Storage } from "aws-amplify";
jest.mock('aws-amplify')

import { loadAuditData } from './AuditData';

// TODO - use the mock or just prime here?


test('it retrieves data from s3 bucket', () => {
    expect.assertions(1);
    loadAuditData();
    expect(Storage.list).toHaveBeenCalled();

});

test('it blows up when data is when s3 is not available', () => {
    expect.assertions(1);
    loadAuditData();
    expect(Storage.list).toHaveBeenCalled();

});


// TODO - replace with a startup request in App.js to retrieve data from s3 and cache
const hardCoded = [
    {
    auditId: "auditNumber1",
    title: "Organisation IT health",
    description: "Assess the your organisations IT awareness and give recommendations for digital",
    pages: [
        {
            pageId: "p1",
            title: "2018 IT audit",
            description: "This is the description",
            questions: [
                {
                    questionId: "p1q1",
                    type: "text",
                    question: "Test",
                },
                {
                    questionId: "p1q2",
                    type: "textarea",
                    question: "Test area",
                },
            ]
        },
        {
            pageId: "p2",
            title: "Information Governance",
            description: "This is some help text",
            questions: [
                {
                    questionId: "p2q1",
                    type: "radio",
                    question: "Do you store your users' data securely either on your systems or in the cloud?",
                    answers: ["yes", "partly", "slightly", "no"]
                },
                {
                    questionId: "p2q2",
                    type: "textarea",
                    question: "Notes",
                },
            ]
        },
        {
            pageId: "p3",
            title: "Page 3",
            description: "This is page 3",
            questions: [
                {
                    questionId: "p3q1",
                    type: "textarea",
                    question: "Fill in some text",
                },
            ]
        },
        {
            pageId: "p4",
            title: "Page 4",
            description: "This is page 4",
            questions: [
                {
                    questionId: "p4q1",
                    type: "textarea",
                    question: "Final page, whats your thoughts?",
                },
            ]
        }
    ]
    },
    {
        auditId: "auditNumber2",
        title: "Do I need a programmer",
        description: "Do you need a programmer or can you buy off the shelf?",
        pages: [
            {
                pageId: "p1",
                title: "2018",
                description: "This is the description",
                questions: [
                    {
                        questionId: "p1q1",
                        type: "text",
                        question: "Test",
                    },
                    {
                        questionId: "p1q2",
                        type: "textarea",
                        question: "Test area",
                    },
                ]
            },
            {
                pageId: "p2",
                title: "Information Governance",
                description: "This is some help text",
                questions: [
                    {
                        questionId: "p2q1",
                        type: "radio",
                        question: "This is question 1 on page 2",
                        answers: ["yes", "partly", "slightly", "no"]
                    },
                    {
                        questionId: "p2q2",
                        type: "textarea",
                        question: "This is question 2 on page 2",
                    },
                    {
                        questionId: "p2q3",
                        type: "radio",
                        question: "This is question 3 on page 2",
                        answers: ["yes", "partly", "slightly", "no"]
                    },
                ]
            }
        ]
    }
];