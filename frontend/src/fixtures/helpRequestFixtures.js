const helpRequestFixtures = {
    oneRequest: {
        "id": 1,
        "requesterEmail": "achiang@ucsb.edu",
        "teamId": "team00",
        "tableOrBreakoutRoom": "room",
        "requestTime": "2022-01-02T12:00:00",
        "explanation": "compile fail",
        "solved": true,
    },
    threeRequests: [
        {
            "id": 1,
            "requesterEmail": "joe@gmail.com",
            "teamId": "team00",
            "tableOrBreakoutRoom": "Table 3",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "dokku help",
            "solved": true,
        },
        {
            "id": 2,
            "requesterEmail": "bob@gmail.com",
            "teamId": "team01",
            "tableOrBreakoutRoom": "Table 1",
            "requestTime": "2022-04-02T12:01:00",
            "explanation": "mutation fail help",
            "solved": false,
        },
        {
            "id": 3,
            "requesterEmail": "katy@gmail.com",
            "teamId": "team02",
            "tableOrBreakoutRoom": "Room",
            "requestTime": "2023-01-02T12:00:02",
            "explanation": "google oauth",
            "solved": true,
        }
    ]
};


export { helpRequestFixtures };