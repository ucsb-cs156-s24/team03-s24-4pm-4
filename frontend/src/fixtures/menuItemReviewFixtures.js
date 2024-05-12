const menuItemReviewFixtures = {
    oneReview: {
        "id": 1,
        "itemId": 1,
        "reviewerEmail": "test@gmail.com",
        "stars": 5,
        "localDateTime": "2022-01-02T12:00:00",
        "comments": "This is a test review"
    },
    threeReviews: [
        {
            "id": 1,
            "itemId": 1,
            "reviewerEmail": "test@gmail.com",
            "stars": 5,
            "localDateTime": "2022-01-02T12:00:00",
            "comments": "This is a test review"
        },
        {
            "id": 2,
            "itemId": 2,
            "reviewerEmail": "a@gmail.com",
            "stars": 4,
            "localDateTime": "2022-01-03T12:00:00",
            "comments": "Test 2"
        },
        {
            "id": 3,
            "itemId": 3,
            "reviewerEmail": "b@gmail.com",
            "stars": 3,
            "localDateTime": "2022-01-04T12:00:00",
            "comments": "Test 3"
        }
    ]
};


export { menuItemReviewFixtures };