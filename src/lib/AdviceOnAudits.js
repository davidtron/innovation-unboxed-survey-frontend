



const hardCoded = [
    {
        auditId: "auditUUID",
        pages: [
            {
                pageId: "p1",
                "default": "good job" // How do i lookup the key, how do we make it uniform so we just used fixed advice?
            },
            {
                pageId: "p2",
                    scores: { // we have scores, and formula
                        p2q1: {
                            "yes" : 5,
                            "partly": 4,
                            "slightly" : 3,
                            "no" : 0
                        },
                        p2q3: {
                            "yes" : 3,
                            "partly": 2,
                            "slightly" : 1,
                            "no" : 0
                        }
                    },
                formula: "( p2q1 + p2q3 / 8 ) * 100",
                results: {
                    "0..20" : "you're doing it all wrong",
                    "20..50" : "you need to do blah",
                    "50..100" : "good job"
                }
}
],
summary: {
    formula: "p1 + p2 + p3",
        results: {
        0..20 : "you're doing it all wrong"
        20..50 : "you need to do blah"
        50..100 : "good job"
    }
}
}

];