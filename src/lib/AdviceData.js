import * as math from 'mathjs';
import { Cache } from "aws-amplify";
import {retrieveDataFile} from "./DataLoader";

const loadAdviceData = async () => {
    Cache.setItem("adviceData", []);
    const auditData = await retrieveDataFile("advice.json");
    Cache.setItem("adviceData", auditData, {expires: 3600000});
    return auditData;
};

const getCachedAdviceData = async () => {
    return Cache.getItem("adviceData", {callback: loadAdviceData});
};

const getAdviceById = async (auditId) => {
    const cachedAdviceData = await getCachedAdviceData();

    const matching = cachedAdviceData.filter(eachAudit => eachAudit.auditId === auditId);
    if (matching.length !== 1) {
        throw new Error("Could not find advice with auditId " +auditId);
    }

    // Found the audit data
    return matching[0];
};

const findScoresForAnswers = (pageAnswers, scores) => {
    let calculationContext = {};
    Object.keys(pageAnswers).forEach(answerId => {
        // Look up scores for answerId, need to handle missing (if theres a non scoreable question)
        let scoresForAnswerId = scores[answerId];
        if (scoresForAnswerId) {
            // Find the calculation and store on the calculationContext

            const currentAnswer = pageAnswers[answerId];
            let scoreForAnswer = scoresForAnswerId[currentAnswer];
            // console.log(answerId + " is " + currentAnswer + " which is scored " + scoreForAnswer);
            calculationContext[answerId] = scoreForAnswer;
        }
    });
    return calculationContext;
};

const convertScoreToAdviceFromResults = (scoreForPage, results) => {
    const calcContext = {x: scoreForPage};

    const matchingResult =  Object.keys(results).find(formula => {
        return math.eval(formula, calcContext);
    });

    if (!matchingResult) throw new Error("Expected to match a score of "+scoreForPage+" result from results " +JSON.stringify(results));

    return results[matchingResult];
};

export const generateAdvice = async (audit, auditAnswers) => {

    const adviceData = await getAdviceById(audit.auditId);
    let adviceForAuditAnswers = {};
    let overallCalculationContext = {};

    Object.keys(auditAnswers).forEach(pageId => {
        const pageAnswers = auditAnswers[pageId];
        const adviceForPage = findPageById(adviceData, pageId);

        if(adviceForPage) {
            const {scores, formula, results} = adviceForPage;
            if(scores && formula) {
                // The page advice should apply the scoring and formula
                // Calc score for each question for given pageAnswers

                // Store the score for a given answer on the calculation context
                let calculationContext = findScoresForAnswers(pageAnswers, scores);

                // get score for current page using formula.
                let scoreForPage = math.eval(formula, calculationContext);

                overallCalculationContext[pageId] = scoreForPage;
                const result = convertScoreToAdviceFromResults(scoreForPage, results);

                adviceForAuditAnswers[pageId] = {
                    score: scoreForPage,
                    result: result
                };
            } else {
                // Does the page have default advice
                if(adviceForPage["default"]) {
                    // The page has generic advice (ie for text field only answers)
                    adviceForAuditAnswers[pageId] = {
                        result: adviceForPage["default"]
                    };
                } else {
                    console.warn("There is no advice defined for page "+ pageId);
                }
            }
        }

    });

    // Now calculate the general advice
    if(adviceData.summary) {
        if(adviceData.summary["default"]) {
            // The advice has just hard coded summary advice
            adviceForAuditAnswers["summary"] = {
                result: adviceData.summary["default"]
            };
        } else {
            const overallSummaryScore = math.eval(adviceData.summary.formula, overallCalculationContext);
            const advice = convertScoreToAdviceFromResults(overallSummaryScore, adviceData.summary.results);

            // console.log(overallCalculationContext);
            // console.log(adviceData.summary.formula);
            // console.log(adviceData.summary.results);
            // console.log(overallSummaryScore);
            // console.log(advice);
            // console.log("------------");

            adviceForAuditAnswers["summary"] = {
                score: overallSummaryScore,
                result: advice
            };
        }
    } else {
        throw new Error("Invalid advice data, no summary section " + JSON.stringify(adviceData));
    }

    return adviceForAuditAnswers;
};


export const findPageById = (dataWithPages, pageId) => {
    const matching = dataWithPages.pages.filter(advicePage => advicePage.pageId === pageId);

    if (matching.length === 1) {
        return matching[0];
    }

    return null;
};
