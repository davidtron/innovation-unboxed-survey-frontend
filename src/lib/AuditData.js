import { Cache } from "aws-amplify";
import {getUsersAudits, saveNewAudit, retrieveDataFile} from "./DataLoader"

export const loadAuditData = async () => {
    Cache.setItem("auditData", []);
    const auditData = await retrieveDataFile("audit.json");
    Cache.setItem("auditData", auditData, {expires: 3600000});
    return auditData;
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

    return inProgressAudits.map(audit =>  {
        return auditListDataFor(cachedAuditData, audit);
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

    return saveNewAudit(params);
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

    // console.log("Audits not started", auditsNotStarted);
    return auditsNotStarted;
};

const auditListDataFor =  (cachedAuditData, usersAudit) => {
    const audit = lookupFromDataById(cachedAuditData, usersAudit.auditId);

    // Calc how much theyve done. If page 0, then 0%, if last page then 100%
    let percentageComplete = Math.round((usersAudit.currentPage / audit.pages.length) * 100);
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