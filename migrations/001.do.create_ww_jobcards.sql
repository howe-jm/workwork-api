CREATE TABLE workwork_jobcards (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    companyname TEXT NOT NULL,
    jobtitle TEXT NOT NULL,
    joburl TEXT NOT NULL,
    date_added TIMESTAMPTZ DEFAULT now() NOT NULL,
    comments TEXT
);