# WorkWork API

This is the API for the WorkWork job and training tracker app.

NOTE: This app includes PostgreSQL Database Migrations! Please ensure you have PostgreSQL installed and running when deploying this app, and follow the Migration steps.

## Set up

### To deploy locally for development

1. Clone this repository to your local machine and change to its directory: `git clone URL/SSH workwork-api && cd $_`
2. Make a fresh start of the git history for this project with `rm -rf .git && git init`
3. Install the node dependencies `npm install`
4. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
5. Create a new database, and update your .env to reflect its name.
6. Migrate the tables in to PostgreSQL: `npm run migrate`
7. (Optional) Create a test database, add it to the .env, migrate the tables in to it using `npm run migrate:test`, and test using `npm t`
8. Run the server in development mode (nodemon) with `npm run dev`

## Endpoints

This API was created for use with the WorkWork React Client (https://github.com/howe-jm/workwork-client). As such, almost all endpoints are designed to function solely for use by that app! Some GET endpoints are included for testing purposes, but shouldn't be considered a part of the API's main functionality.

### Job Cards Endpoints

#### /api/jobs/:user_name

This endpoint will return ALL STATE DATA for the given user's job cards, if any exist. It will return an array of objects, with each object representing a single card.

This endpoint supports GET requests only!

Each card is formatted as in this example:

```
{
"id": 14,
"userId": 1,
"companyName": "Test",
"jobTitle": "Test",
"jobUrl": "https://www.google.com",
"comments": "",
"contacts": [
    {
        "id": 8,
        "contactName": "Test Contact",
        "contactNumber": "123-456-7890",
        "contactTitle": "Test Title",
        "contactEmail": "test@test.com",
        "cardId": 14
        }
    ],
"events": [
    {
        "id": 13,
        "eventType": "test",
        "cardId": 14,
        "dateAdded": "2020-11-22T18:26:40.773Z"
        }
    ]
}
```

#### /api/jobs/:user_name/contacts/:card_id

This endpoint is for the manipulation of Job Contacts on a given card. If the card does not belong to the user specified, it will not allow any changes to be made.

1. GET - For testing purposes, you may fetch and view contacts in Postman or similar.

2. POST - You may create a new contacts for a specified card, in the following format:

```
   {
   "contactName": "Test Name", (string)
   "contactTitle": "Test Title", (string)
   "contactNumber": "123-456-7890", (string)
   "contactEmail": "test@test.com", (string, must be a valid email address)
   }
```

Note: Contacts must have at least a number or an email.

3. PATCH - Individual contacts may be edited using the same format for POST.

4. DELETE - Deletes an individual contact.

#### /api/jobs/:user_name/events/:card_id

This endpoint is for the manipulation of Job Events on a given card. If the card does not belong to the user specified, it will not allow any changes to be made.

1. GET - For testing purposes, you may fetch and view contacts in Postman or similar.

2. POST - You may create a new contacts for a specified card, in the following format:

```
   {
   "eventType": "Test Event", (string)
   }
```

3. DELETE - Deletes an individual contact.

#### /api/jobs/:user_name/cards/

This endpoint exists solely for creating entirely new job cards. New cards will be be created with no events or contacts, which may be added after creation.

1. POST - Creates a new job card, using the following format:

```
{
"companyName": "Test Company", (string)
"jobTitle": "Test Title", (string)
"jobUrl": "http://www.google.com", (string, must be valid URL)
}
```

#### /api/jobs/:user_name/cards/:card_id

This endpoint allows for the manipulation of individual job cards.

1. GET - For testing purposes, using Postman or similar, you may fetch and view cards (without contacts or events data).

2. PATCH - Individual job cards may be edited, though this is not implemented in the live app. Format is the same as the POST format for job cards.

3. DELETE - To delete individual job cards.

### Study Cards Endpoints

#### /api/study/:user_name

This endpoint will return ALL STATE DATA for the given user's study cards, if any exist. It will return an array of objects, with each object representing a single card.

This endpoint supports GET requests only!

Each card is formatted as in this example:

```
    {
        "id": 8,
        "userId": 1,
        "trainingName": "Test Card",
        "trainingUrl": "",
        "dateAdded": "2020-11-22T18:25:42.435Z",
        "comments": "",
        "events": [
             {
                "id": 13,
                "eventType": "test",
                "cardId": 14,
                "dateAdded": "2020-11-22T18:26:40.773Z"
            }
        ]
    }
```

#### /api/study/:user_name/events/:card_id

This endpoint is for the manipulation of Study Events on a given card. If the card does not belong to the user specified, it will not allow any changes to be made.

1. GET - For testing purposes, you may fetch and view contacts in Postman or similar.

2. POST - You may create a new contacts for a specified card, in the following format:

```
   {
   "eventType": "Test Event", (string)
   }
```

3. DELETE - Deletes an individual contact.

#### /api/study/:user_name/cards/

This endpoint exists solely for creating entirely new study cards. New cards will be be created with no events or contacts, which may be added after creation.

1. POST - Creates a new study card, using the following format:

```
{
"trainingName": "Study Test", (string)
"trainingUrl": "http://www.google.com", (string, optional, must be valid URL)
}
```

#### /api/study/:user_name/cards/:card_id

This endpoint allows for the manipulation of individual study cards.

1. GET - For testing purposes, using Postman or similar, you may fetch and view cards (without contacts or events data).

2. PATCH - Individual study cards may be edited, though this is not implemented in the live app. Format is the same as the POST format for job cards.

3. DELETE - To delete individual study cards.

### Users Endpoints

A rudimentary, non-secured system for keeping track of individual user cards is implemented in this API, and will be turned in to a secure authentication system at a later date. For now, the React App will track and allow for the creation of users, but nothing else.

#### /api/users/

1. GET - Fetches all user data and returns it. Currently used to populate user selection drop-down.

2. POST - Allows a new user to be created, with the following format:

```
   {
   "firstName": "Test", (string)
   "lastName": "Test", (string)
   "userName": "TestUsername" (string, must be unique.)
   }
```

NOTE: A Placeholder password is assigned automatically.

#### /apu/users/:user_name

1. GET - Fetches individial user data based on username.

## Deploying

This API is currently set up to be deployed to Heroku. To do so, follow these steps:

1. Create a new repo on Heroku for the API by running: `heroku create`
2. Deploy the API to Heroku with `npm run deploy`
3. Create a database on Heroku for the app and update environment variables appropriately (Heroku should do this automatically)
4. Migrate tables in to the database with `npm run postdeploy`
5. Verify that the API is running using the provided URL and Postman.
