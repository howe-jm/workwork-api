function makeStudyCardsArray() {
  return [
    {
      id: 2,
      trainingName: 'Resume Master',
      trainingUrl: 'https://www.linkedin.com',
      dateAdded: '2020-11-09T18:31:50.909Z',
      events: [
        {
          id: 2,
          eventType: 'Video Watched',
          dateAdded: '2019-02-13T00:00:00.000Z',
          cardId: 2,
        },
        {
          id: 12,
          eventType: 'Video Watched',
          dateAdded: '2019-02-13T00:00:00.000Z',
          cardId: 2,
        },
      ],
      comments: 'What even is this?',
      userId: 1,
    },
    {
      id: 9,
      trainingName: 'Songs to Sing',
      trainingUrl: 'https://www.scary-monster-fighting.com',
      dateAdded: '2020-11-09T18:31:50.909Z',
      events: [
        {
          id: 9,
          eventType: 'Book Read',
          dateAdded: '2019-04-09T00:00:00.000Z',
          cardId: 9,
        },
        {
          id: 19,
          eventType: 'Book Read',
          dateAdded: '2019-04-09T00:00:00.000Z',
          cardId: 9,
        },
      ],
      comments: null,
      userId: 1,
    },
    {
      id: 10,
      trainingName: 'Nobodys Business',
      trainingUrl: 'https://www.cn.com',
      dateAdded: '2020-11-09T18:31:50.909Z',
      events: [
        {
          id: 10,
          eventType: 'Certificate Earned',
          dateAdded: '2019-05-12T00:00:00.000Z',
          cardId: 10,
        },
        {
          id: 20,
          eventType: 'Certificate Earned',
          dateAdded: '2019-05-12T00:00:00.000Z',
          cardId: 10,
        },
      ],
      comments: 'Good book',
      userId: 1,
    },
  ];
}

module.exports = { makeStudyCardsArray };
