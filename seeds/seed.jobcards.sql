BEGIN;

INSERT INTO workwork_jobcards (companyname, jobtitle, joburl, comments, user_id)
VALUES
('Google', 'Senior Software Engineer', 'https://www.google.com', 'Probably unqualified.', 2),
('LinkedIn', 'DevOps Engineer', 'https://www.linkedin.com', 'That is not the right place to be.', 1),
('Facebook', 'Junior React Engineer', 'https://www.facebook.com', 'Might be evil.', 3),
('Oracle', 'Network Engineer', 'https://www.oracle.com', null, 4),
('Mr. Robot', 'QA Software Engineer', 'https://www.mrrobot.com', 'Do not underesimate this guy.', 5),
('The Godfather', 'Elimination Engineer', 'https://www.not-the-mafia.com', 'Kinda sus', 4),
('Pizza Hut', 'Pizza Designer', 'https://www.pizzahut.com', null, 3),
('Shawshank Pen.', 'Software Development Instructor', 'https://www.shawshank-prison.com', 'Maybe. I know someone there.', 2),
('Jimmy Crack Corns', 'Boogieman Specialist', 'https://www.scary-monster-fighting.com', null, 1),
('Cartoon Network', 'Program Engineer', 'https://www.cn.com', 'Not the right kind of job', 1),
('Huntington National Bank', 'Junior Web Developer', 'https://www.huntington.com', 'Sure, this might work.', 2),
('Chuck E. Cheeses', 'Cheese Pizza Architect', 'https://www.chuckecheese.com', 'Free pizza?', 4);

COMMIT;