function makeJobContactsJson() {
  return [
    {
      id: 4,
      contactName: 'Jake Blake',
      contactNumber: '212-444-2024',
      contactTitle: 'Chief Slapper',
      contactEmail: 'testemail@testemail.test',
      dateAdded: '2019-04-10T00:00:00.000Z',
      cardId: 2,
    },
    {
      id: 5,
      contactName: 'Sarah Connor',
      contactNumber: '212-444-2025',
      contactTitle: 'Bass Master',
      contactEmail: 'testemail@testemail.test',
      dateAdded: '2019-04-10T00:00:00.000Z',
      cardId: 2,
    },
  ];
}

module.exports = { makeJobContactsJson };
