import { API } from "aws-amplify";


export const availableAudits = (audits) => {
    // Determine from the passed in data what other audits could be created.
    // ie if i have no audits i can create all the available audit types.

    // When the app starts up we want to load the available audit types, once
    //const getAvailableAuditTypes = hardCoded;

    return [
        {
            auditId: "auditNumber1",
            title: "Organisation IT health",
            description: "Assess the your organisations IT awareness and give recommendations for digital"
        },
        {
            auditId: "auditNumber2",
            title: "Do I need a programmer?",
            description: "Do you need a programmer or can you buy off the shelf?"
        }
    ];
};

export const createAudit = async (auditId) => {
    let audit = lookupById(auditId);

    // Create empty answers
    let emptyAnswers = emptyAnswersForPages(audit.pages);

    let params = {
        auditId: auditId,
        auditAnswers: JSON.stringify(emptyAnswers)
    };

    return API.post("audits", "/audits", {
        body: params
    });
};

export const auditListDataFor = (usersAudit) => {
    // TODO: Lookup the audit data from cache, use hardcoded for now
    const audit = lookupById(usersAudit.auditId);

    // Calc how much theyve done. If page 0, then 0%, if last page then 100%
    let percentageComplete =  (usersAudit.currentPage  / audit.pages.length) * 100;
    if(usersAudit.complete) {
        percentageComplete = 100;
    }
    
    return {
        title: audit.title,
        description: audit.description,
        percentageComplete: percentageComplete,
        lastEditTime: usersAudit.lastEditTime
    }
};




export const lookupById = auditId => {
    // TODO: Find the correct audit data
    // Where is this cached? for now look at the hardcoded

    const matching = hardCoded.filter(eachAudit => eachAudit.auditId === auditId);
    if (matching.length !== 1) {

        // TODO boom - how to handle errors?
        // Think this whole method should be async and return an error for front end to handle (same as if aws connectivity down)
        throw new Error("Could not find " +auditId);
    }

    // Found the audit data
    return matching[0];
};

// Generate empty answers for questions on a page
const emptyAnswersForPages = pages => {

    let emptyAnswersForEachPage = {};
    pages.forEach((page) => {
        const answers = emptyStateValuesForAnswers(page.questions);
        emptyAnswersForEachPage[page.pageId] = answers;
    });
    return emptyAnswersForEachPage;
};


// Generate empty answers for current question
const emptyStateValuesForAnswers = questions => {
    let answers = {};
    questions.forEach((question) => {
        answers[question.questionId] = "";
    });

    return answers;
};



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