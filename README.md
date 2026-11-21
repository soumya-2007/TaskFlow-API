# TaskFlow API

A simple RESTful Task Management API built using Node.js and Express.js. It supports user registration, login, and complete task CRUD operations.

This project also integrates my own npm package, **[@soumya_jalihal/express-input-guard](https://www.npmjs.com/package/@soumya_jalihal/express-input-guard)**, for request validation.

## Features

- User registration and login
- Password hashing using bcrypt
- Create, read, update, and delete tasks
- Request validation using a custom npm package
- JSON file-based data storage
- Proper HTTP status codes and error handling

## Tech Stack

- Node.js
- Express.js
- JavaScript
- bcrypt
- express-input-guard
- JSON

## Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate into the project:

   ```bash
   cd TaskFlow-API
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   node server.js
   ```

The API runs at `http://localhost:3000`.

## API Endpoints

### Users

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Login an existing user |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a task |
| GET | `/tasks?userId=USER_ID` | Get all tasks for a user |
| GET | `/tasks/:id` | Get a task by ID |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Example Requests

### Register a user

```json
{
  "name": "Aman",
  "email": "aman@gmail.com",
  "password": "123456"
}
```

### Create a task

```json
{
  "userId": 123456,
  "title": "Complete TaskFlow API",
  "description": "Build and test my backend project"
}
```

### Update a task

```json
{
  "title": "Updated Task",
  "completed": true
}
```

## Custom npm Package Integration

This project uses my own npm package:

`@soumya_jalihal/express-input-guard`

It provides Express middleware for validating request bodies, query parameters, and URL parameters.

Example:

```javascript
const { validate } = require("@soumya_jalihal/express-input-guard");

router.post(
    "/register",
    validate({
        body: {
            email: {
                required: true,
                type: "email"
            }
        }
    }),
    (req, res) => {
        // Route logic
    }
);
```

## Data Storage

This project currently uses local JSON files:

- `data/users.json`
- `data/tasks.json`

## Future Improvements

- JWT-based authentication
- Database integration
- Protected task routes
- Improved validation and security

## Author

**Soumya Jalihal**

GitHub: [soumya-2007](https://github.com/soumya-2007)