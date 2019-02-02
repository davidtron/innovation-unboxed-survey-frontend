import * as math from 'mathjs';
import { Storage, Cache } from "aws-amplify";
import { utf8ArrayToStr } from "./JsonHelper";

const useStub = false;

const loadAdviceData = async () => {

    if(useStub) {
        const stubbedAdviceData = await fakeLoadAdviceData();
        Cache.setItem("adviceData", stubbedAdviceData, {expires: 3600000});
        return stubbedAdviceData;
    }

    Cache.setItem("adviceData", []);
    const result = await Storage.get("advice.json", {download: true, expires: 3600000});
    const cachedAdviceData = JSON.parse(utf8ArrayToStr(result.Body));
    Cache.setItem("adviceData", cachedAdviceData, {expires: 3600000});
    return cachedAdviceData;
};

const getCachedAdviceData = async () => {
    return Cache.getItem("adviceData", {callback: loadAdviceData});
};

const getAdviceById = async (auditId) => {
    const cachedAdviceData = await getCachedAdviceData();
    console.log("getAdviceById", cachedAdviceData);


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
            console.log(answerId + " is " + currentAnswer + " which is scored " + scoreForAnswer);
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
                //console.log("pageAnswers",pageAnswers);

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
                // The page has generic advice (ie for text field only answers)
                adviceForAuditAnswers[pageId] = {
                    result: adviceForPage["default"]
                };
            }
        }

    });

    // Now calculate the general advice
    if(adviceData.summary) {
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

    return adviceForAuditAnswers;
};


export const findPageById = (dataWithPages, pageId) => {
    const matching = dataWithPages.pages.filter(advicePage => advicePage.pageId === pageId);

    if (matching.length === 1) {
        return matching[0];
    }

    return null;
};

const fakeLoadAdviceData = async () => {
    return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(hardCoded), 400);
    });
};


const hardCoded = [
    {
        auditId: "auditNumber2",
        pages: [
            {
                pageId: "p1",
                "default": "hard coded advice from page 1"
            },
            {
                pageId: "p2",
                scores: { // we have scores, and formula
                    p2q1: {
                        "yes": 5,
                        "partly": 4,
                        "slightly": 3,
                        "no": 0
                    },
                    p2q3: {
                        "yes": 3,
                        "partly": 2,
                        "slightly": 1,
                        "no": 0
                    }
                },
                formula: "((p2q1 + p2q3) / 8)*100",
                results: {
                    "0 < x < 20" : "you're doing it all wrong",
                    "20 < x < 50" : "you need to do blah",
                    "50 < x <= 100" : "good job"
                }
            }
        ],
        summary: {
            formula: "p2 + 3",
            results: {
                "0 < x < 20" : "overall summary is bad",
                "20 < x < 50" : "overall summary is blah",
                "50 < x <= 100" : "overall summary is good job"
            }
        }
    }

];