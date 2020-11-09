BEGIN;

INSERT INTO workwork_studycards (trainingname, trainingurl, comments, user_id)
VALUES
('Google', 'https://www.google.com', 'Googled stuff.', 2),
('Resume Master', 'https://www.linkedin.com', 'What even is this?', 1),
('React Hooks', 'https://www.facebook.com', 'Irrelevant!', 3),
('Java Stuff', 'https://www.oracle.com', null, 4),
('TV Schedule', 'https://www.mrrobot.com', 'Random stuff', 5),
('How to Program Your VCR', 'https://www.not-the-mafia.com', 'WIP', 4),
('Pizza Ordering 101', 'https://www.pizzahut.com', null, 3),
('Living the Life', 'https://www.shawshank-prison.com', 'Done with this', 2),
('Songs to Sing', 'https://www.scary-monster-fighting.com', null, 1),
('Nobodys Business', 'https://www.cn.com', 'Good book', 1);

COMMIT;