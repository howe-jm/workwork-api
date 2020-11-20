function makeJobCardsArray() {
  return [
    {
      id: 2,
      companyname: 'LinkedIn',
      jobtitle: 'DevOps Engineer',
      joburl: 'https://www.linkedin.com',
      job_added: '2020-11-09T18:30:16.970Z',
      comments: 'That is not the right place to be.',
      user_id: 1,
    },
    {
      id: 9,
      companyname: 'Jimmy Crack Corns',
      jobtitle: 'Boogieman Specialist',
      joburl: 'https://www.scary-monster-fighting.com',
      job_added: '2020-11-09T18:30:16.970Z',
      comments: null,
      user_id: 1,
    },
    {
      id: 10,
      companyname: 'Cartoon Network',
      jobtitle: 'Program Engineer',
      joburl: 'https://www.cn.com',
      job_added: '2020-11-09T18:30:16.970Z',
      comments: 'Not the right kind of job',
      user_id: 1,
    },
  ];
}
module.exports = { makeJobCardsArray };
