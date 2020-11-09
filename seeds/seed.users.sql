BEGIN;

INSERT INTO workwork_users (firstname, lastname, username, password)
VALUES
('Jimmy', 'Crack Corn', 'jkrakz', 'asupersecurepassword'),
('Jenny', 'Smith', 'smith-j', 'password'),
('Sam', 'Iam', 'SamIamImaS', 'samsamsam'),
('Dennis', 'Nedry', 'MagicWord', 'Ah-ah-ah!'),
('Lilly', 'Radio', 'User5', 'admin');

COMMIT;