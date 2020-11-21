function makeJobCardsState() {
  return [
    {
      id: 2,
      userId: 1,
      companyName: 'LinkedIn',
      jobTitle: 'DevOps Engineer',
      jobUrl: 'https://www.linkedin.com',
      comments: 'That is not the right place to be.',
      contacts: [
        {
          id: 4,
          contactName: 'Jake Blake',
          contactNumber: '212-444-2024',
          contactTitle: 'Chief Slapper',
          contactEmail: 'testemail@testemail.test',
          cardId: 2,
        },
        {
          id: 5,
          contactName: 'Sarah Connor',
          contactNumber: '212-444-2025',
          contactTitle: 'Bass Master',
          contactEmail: 'testemail@testemail.test',
          cardId: 2,
        },
      ],
      events: [
        {
          id: 6,
          eventType: 'Resume Submitted',
          cardId: 2,
          dateAdded: '2019-02-12T00:00:00.000Z',
        },
        {
          id: 16,
          eventType: 'Interview',
          cardId: 2,
          dateAdded: '2019-04-10T00:00:00.000Z',
        },
        {
          id: 23,
          eventType: 'Follow-Up Call',
          cardId: 2,
          dateAdded: '2019-04-09T00:00:00.000Z',
        },
      ],
    },
    {
      id: 9,
      userId: 1,
      companyName: 'Jimmy Crack Corns',
      jobTitle: 'Boogieman Specialist',
      jobUrl: 'https://www.scary-monster-fighting.com',
      comments: '',
      contacts: [
        {
          id: 21,
          contactName: 'Chris Camper',
          contactNumber: '212-444-2041',
          contactTitle: 'DJ',
          contactEmail: 'testemail@testemail.test',
          cardId: 9,
        },
        {
          id: 22,
          contactName: 'Mayor McCheese',
          contactNumber: '212-444-2042',
          contactTitle: 'Vendor',
          contactEmail: 'testemail@testemail.test',
          cardId: 9,
        },
      ],
      events: [
        {
          id: 3,
          eventType: 'Resume Submitted',
          cardId: 9,
          dateAdded: '2019-02-13T00:00:00.000Z',
        },
        {
          id: 12,
          eventType: 'Interview',
          cardId: 9,
          dateAdded: '2019-03-02T00:00:00.000Z',
        },
      ],
    },
    {
      id: 10,
      userId: 1,
      companyName: 'Cartoon Network',
      jobTitle: 'Program Engineer',
      jobUrl: 'https://www.cn.com',
      comments: 'Not the right kind of job',
      contacts: [
        {
          id: 24,
          contactName: 'Wilson Wilson',
          contactNumber: '212-444-2044',
          contactTitle: 'Card Shuffler',
          contactEmail: 'testemail@testemail.test',
          cardId: 10,
        },
      ],
      events: [
        {
          id: 36,
          eventType: 'Test Test',
          cardId: 10,
          dateAdded: '2020-11-17T23:24:00.730Z',
        },
        {
          id: 37,
          eventType: 'Test Test',
          cardId: 10,
          dateAdded: '2020-11-17T23:24:11.624Z',
        },
      ],
    },
  ];
}
module.exports = { makeJobCardsState };
