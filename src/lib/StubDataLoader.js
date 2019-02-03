
function eventuallyReturn(data) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(data), 400));
}

export const retrieveDataFile = async (fileName) => {
    console.log("Resolving stubbed " + fileName);

    if(fileName === "audit.json") {
        return eventuallyReturn(auditData);
    } else if(fileName === "advice.json") {
        return eventuallyReturn(adviceData);
    }

    throw new Error("Dont know " + fileName);
};

export const loadAuditById = async (auditAnswersId) => {
    console.log("Resolving stubbed audit answerId " + auditAnswersId);

    if(auditAnswersId === newAuditId) {
        return eventuallyReturn(newAuditAnswer);
    } else if(auditAnswersId === existingAuditId) {
        return eventuallyReturn(auditAnswer);
    }

    throw new Error("Could not load audit answers Id " + auditAnswersId);
};

export const updateAudit = async (auditAnswersId, auditDataToSave) => {
    newAuditAnswer = auditDataToSave;
    return eventuallyReturn(newAuditAnswer);
};

export const saveNewAudit = async (auditDataToSave) =>{

    newAuditAnswer = auditDataToSave;
    newAuditAnswer.auditAnswersId = newAuditId;
    newAuditAnswer.complete = false;
    newAuditAnswer.currentPage = 0;
    newAuditAnswer.lastEditTime = 1549129906815;

    console.log("Saving new audit to answer ", newAuditAnswer);
    return eventuallyReturn(newAuditAnswer);
};

export const getUsersAudits = async () => {
    return eventuallyReturn([auditAnswer]);
};


let newAuditAnswer = {};

// --- Sample data ---

const existingAuditId = "2334b5b0-25eb-11e9-abb0-6d7f3cb88d29";
const newAuditId = "6d7f3cb88d29-2334b5b0-25eb-11e9-abb0";

const auditAnswer = {
    auditAnswers: "{\"p1\":{\"p1q1\":\"foo\",\"p1q2\":\"bar\"},\"p2\":{\"p2q1\":\"yes\",\"p2q2\":\"op\",\"p2q3\":\"yes\"}}",
    auditAnswersId: existingAuditId,
    auditId: "auditNumber2",
    complete: false,
    currentPage: 1,
    lastEditTime: 1549129906815,
    userId: "eu-west-1:be22bc33-23ec-42b5-88c0-59a4fdd17d86"
};

const auditData = [
    {
        auditId: "auditNumber1",
        title: "Organisation IT health",
        description: "Assess the your organisations IT awareness and give recommendations for digital",
        pages: [
            {
                pageId: "p1",
                title: "2018 IT audit",
                description: "This is the description Lorem ipsum dolor sit amet, unum falli dissentiet sed ea, invidunt concludaturque an eos. Sea referrentur philosophia cu, mundi dicant viderer at vel, ne eam sanctus definiebas argumentum. Has te quas partem. Mea scaevola elaboraret eu, at vel suscipit dissentiet accommodare. Eu vel vide deterruisset, vitae altera perpetua ius te.\n Omnium accumsan imperdiet est ei, homero salutatus pro id, eu inermis reprimique has. Mea te reque animal, pri reque instructior an. Eu pri malis labore mediocritatem, dolorem accusam sed cu. Tale minimum in nam, cu integre phaedrum mel.\n Mea facete mediocritatem id, ad vero reque has, sea prompta veritus vituperata eu. Stet blandit consectetuer cum ei, id sea alienum principes torquatos. Nonumes appetere sit in, exerci convenire an sea, ut vix magna fabellas urbanitas. Soluta consectetuer te mea, viderer noluisse in duo. Et soluta fuisset ius, usu eros liber urbanitas ne, clita perfecto nam ei.\n Ea his eirmod accusamus, iuvaret commune sea no. Est omnis decore an, lucilius imperdiet at vim. Etiam neglegentur eam ex, alia nulla an vix, et minim facilis his. Has nulla simul accumsan ad, ea usu viris aliquip. Unum epicurei perpetua no cum, ei sed nibh mnesarchum. Omnis quidam ad ius, ea vide veri tation ius.\n Has postea option aliquando id, ne malorum accusam deserunt eum, inani oportere maiestatis ea eum. Nostrum assentior consequuntur id eos, possit melius gubergren at vix, scripta necessitatibus est ad. Ei graeci aliquam pri. Affert imperdiet cotidieque ea mel. Ea pro noster corrumpit.",
                questions: [
                    {
                        questionId: "p1q1",
                        type: "text",
                        question: "What is your organisations name?",
                        required: true
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
                        answers: ["yes", "partly", "slightly", "no"],
                        required: true
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
                        required: true
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
                        answers: ["yes", "partly", "slightly", "no"],
                        required: true
                    },
                    {
                        questionId: "p2q2",
                        type: "textarea",
                        question: "Optional this is question 2 on page 2",
                    },
                    {
                        questionId: "p2q3",
                        type: "radio",
                        question: "This is question 3 on page 2",
                        answers: ["yes", "partly", "slightly", "no"],
                        required: true
                    },
                ]
            }
        ]
    }
];

const adviceData = [
    {
        auditId: "auditNumber1",
        pages: [
            {
                pageId: "p1",
                "default": "hard coded advice from page 1\nLorem ipsum dolor sit amet, unum falli dissentiet sed ea, invidunt concludaturque an eos. Sea referrentur philosophia r at vel, ne eam sanctus definiebas argumentum. Has te quas partem. Mea scaevola elaboraret eu, at vel suscipit dissentiet accommodare. Eu vel vide deterruisset, vitae altera perpetua ius te.\n Omnium accumsan imperdiet est ei, homero salutatus pro id, eu inermis reprimique has. Mea te reque animal, pri reque instructior an. Eu pri malis labore mediocritatem, dolorem accusam sed cu. Tale minimum in nam, cu integre phaedrum mel.\n Mea facete mediocritatem id, ad vero reque has, sea prompta veritus vituperata eu. Stet blandit consectetuer cum ei, id sea alienum principes torquatos. Nonumes appetere sit in, exerci convenire an sea, ut vix magna fabellas urbanitas. Soluta consectetuer te mea, viderer noluisse in duo. Et soluta fuisset ius, usu eros liber urbanitas ne, clita perfecto nam ei.\n Ea his eirmod accusamus, iuvaret commune sea no. Est omnis decore an, lucilius imperdiet at vim. Etiam neglegentur eam ex, alia nulla an vix, et minim facilis his. Has nulla simul accumsan ad, ea usu viris aliquip. Unum epicurei perpetua no cum, ei sed nibh mnesarchum. Omnis quidam ad ius, ea vide veri tation ius.\n Has postea option aliquando id, ne malorum accusam deserunt eum, inani oportere maiestatis ea eum. Nostrum assentior consequuntur id eos, possit melius gubergren at vix, scripta necessitatibus est ad. Ei graeci aliquam pri."
            }
        ],
        summary: {
            "default": "Lorem ipsum dolor sit amet, unum falli dissentiet sed ea, invidunt concludaturque an eos. Sea referrentur philosophia cu, mundi dicant viderer at vel, ne eam sanctus definiebas argumentum. Has te quas partem. Mea scaevola elaboraret eu, at vel suscipit dissentiet accommodare. Eu vel vide deterruisset, vitae altera perpetua ius te.\n Omnium accumsan imperdiet est ei, homero salutatus pro id, eu inermis reprimique has. Mea te reque animal, pri reque instructior an. Eu pri malis labore mediocritatem, dolorem accusam sed cu. Tale minimum in nam, cu integre phaedrum mel.\n Mea facete mediocritatem id, ad vero reque has, sea prompta veritus vituperata eu. Stet blandit consectetuer cum ei, id sea alienum principes torquatos. Nonumes appetere sit in, exerci convenire an sea, ut vix magna fabellas urbanitas. Soluta consectetuer te mea, viderer noluisse in duo. Et soluta fuisset ius, usu eros liber urbanitas ne, clita perfecto nam ei.\n Ea his eirmod accusamus, iuvaret commune sea no. Est omnis decore an, lucilius imperdiet at vim. Etiam neglegentur eam ex, alia nulla an vix, et minim facilis his. Has nulla simul accumsan ad, ea usu viris aliquip. Unum epicurei perpetua no cum, ei sed nibh mnesarchum. Omnis quidam ad ius, ea vide veri tation ius.\n Has postea option aliquando id, ne malorum accusam deserunt eum, inani oportere maiestatis ea eum. Nostrum assentior consequuntur id eos, possit melius gubergren at vix, scripta necessitatibus est ad. Ei graeci aliquam pri. Affert imperdiet cotidieque ea mel. Ea pro noster corrumpit."
        }
    },
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
            formula: "p2",
            results: {
                "0 < x < 20" : "overall summary is bad",
                "20 < x < 50" : "overall summary is blah",
                "50 < x <= 100" : "overall summary is good job"
            }
        }
    }
];