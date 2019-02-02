import {API, Storage, Cache} from "aws-amplify";
import {utf8ArrayToStr} from "./JsonHelper";

const useStub = false;

export const loadAuditData = async () => {
    if(useStub) {
        const stubbedAuditData = await fakeLoadAuditData();
        Cache.setItem("auditData", stubbedAuditData, {expires: 3600000});
        return stubbedAuditData;
    }

    Cache.setItem("auditData", []);
    const result = await Storage.get("audit.json", {download: true, expires: 3600000});
    let cachedAuditData = JSON.parse(utf8ArrayToStr(result.Body));
    Cache.setItem("auditData", cachedAuditData, {expires: 3600000});
    return cachedAuditData;
};

export const lookupById = async (auditId) => {
    const cachedAuditData = await getCachedAuditData();
    return lookupFromDataById(cachedAuditData, auditId);
};

export const getUnstartedAudits = async () => {
    const inProgressAudits = await getUsersAudits();
    return availableAudits(inProgressAudits);
};

export const getInProgressAudits = async () => {
    const inProgressAudits = await getUsersAudits();

    const cachedAuditData = await getCachedAuditData();

    console.log('cached audit data ', cachedAuditData);
    console.log('in progress audits are ', inProgressAudits);

    return inProgressAudits.map(audit =>  {
        return auditListDataFor(cachedAuditData, audit);
    });
};

export const loadAuditById = async (auditId) => {
    return API.get("audits", `/audits/${auditId}`);
};

export const saveAudit = async (auditId, auditDataToSave) => {
    return API.put("audits", `/audits/${auditId}`, {
        body: auditDataToSave
    });
};

export const createAudit = async (auditId) => {
    const audit = await lookupById(auditId);

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

const getCachedAuditData = async () => {
    return Cache.getItem("auditData", {callback: loadAuditData});
};

const availableAudits = async (inProgressAudits) => {
    // Loop through audit ids of audits in progress / complete
    // Filter those out from the cached audit data and return
    const inProgressAuditIds = inProgressAudits.map(audit => audit.auditId);
    const cachedAuditData = await getCachedAuditData();

    const auditsNotStarted = cachedAuditData.filter(availableAudit => !(inProgressAuditIds.includes(availableAudit.auditId)));

    console.log("Audits not started", auditsNotStarted);
    return auditsNotStarted;
};

const auditListDataFor =  (cachedAuditData, usersAudit) => {
    const audit = lookupFromDataById(cachedAuditData, usersAudit.auditId);

    // Calc how much theyve done. If page 0, then 0%, if last page then 100%
    let percentageComplete = (usersAudit.currentPage / audit.pages.length) * 100;
    if (usersAudit.complete) {
        percentageComplete = 100;
    }

    return {
        title: audit.title,
        description: audit.description,
        percentageComplete: percentageComplete,
        lastEditTime: usersAudit.lastEditTime,
        auditAnswersId: usersAudit.auditAnswersId
    }
};



const getUsersAudits = async () =>  {
    if(useStub) {
        return new Promise(function(resolve, reject) {
            setTimeout(() => resolve([
                {
                    auditId: "auditNumber1",
                    auditAnswersId: "sfaas-errwe-ewrqrqw-qwrqqwr",
                    complete : false,
                    currentPage : 1,
                    description : "Mock description",
                    lastEditTime : 1548715252279,
                    title : "Mock title"
                }
            ]), 1400);
        });
    }

    return API.get("audits", "/audits");
};


// ---- sync calls

const lookupFromDataById = (auditData, auditId) => {
    const matching = auditData.filter(eachAudit => eachAudit.auditId === auditId);
    if (matching.length !== 1) {
        throw new Error("Could not find audit with id" + auditId);
    }
    return matching[0];
};

// Generate empty answers for questions on a page
const emptyAnswersForPages = pages => {

    let emptyAnswersForEachPage = {};
    pages.forEach((page) => {
        emptyAnswersForEachPage[page.pageId] = emptyStateValuesForAnswers(page.questions);
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


//---

const fakeLoadAuditData = async () => {
    return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(hardCoded), 400);
    });
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