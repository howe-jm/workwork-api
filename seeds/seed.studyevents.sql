BEGIN;

INSERT INTO workwork_studyevents (event_type, card_id, date_added)
VALUES
('Video Watched', 1, '2019-02-12T00:00:00.000Z'),
('Video Watched', 2, '2019-02-13T00:00:00.000Z'),
('Video Watched', 3, '2019-02-13T00:00:00.000Z'),
('Video Watched', 4, '2019-02-14T00:00:00.000Z'),
('Project Completed', 5, '2019-03-01T00:00:00.000Z'),
('Project Completed', 6, '2019-03-02T00:00:00.000Z'),
('Project Completed', 7, '2019-03-02T00:00:00.000Z'),
('Book Read', 8, '2019-04-09T00:00:00.000Z'),
('Book Read', 9, '2019-04-09T00:00:00.000Z'),
('Certificate Earned', 10, '2019-05-12T00:00:00.000Z');

COMMIT;