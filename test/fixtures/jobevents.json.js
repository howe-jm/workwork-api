function makeJobEventsJson() {
  return [
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
  ];
}

module.exports = { makeJobEventsJson };
