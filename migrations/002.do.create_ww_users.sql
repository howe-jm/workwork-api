CREATE TABLE workwork_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT,
    user_added TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE workwork_jobcards
    ADD COLUMN
        user_id INTEGER REFERENCES workwork_users(id)
        ON DELETE SET NULL;