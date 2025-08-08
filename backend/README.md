### Users API

#### POST /users/register

Registers a new user and returns a JWT along with the created user document.

- **Base path**: `/users`
- **Endpoint**: `POST /users/register`
- **Content-Type**: `application/json`

#### Request body

Provide a JSON object with the following shape:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

- **fullname.firstname**: string, required, min length 3
- **fullname.lastname**: string, optional, min length 3 if provided
- **email**: string, required, must be a valid email
- **password**: string, required, min length 6

Example cURL:

```bash
curl -X POST "http://localhost:PORT/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "password": "secret123"
  }'
```

#### Responses

- **201 Created**: Registration successful
  - Body:
    ```json
    {
      "token": "<jwt>",
      "user": { /* created user document */ }
    }
    ```

- **400 Bad Request**: Validation failed or duplicate email
  - Validation errors (from validators):
    ```json
    {
      "errors": [
        { "msg": "First name must be at least 3 characters long", "param": "fullname.firstname", "location": "body" },
        { "msg": "Invalid email", "param": "email", "location": "body" },
        { "msg": "Password must be at least 6 characters long", "param": "password", "location": "body" }
      ]
    }
    ```
  - Duplicate email:
    ```json
    { "message": "User already exist" }
    ```

- **500 Internal Server Error**: Unexpected server error
  - Body:
    ```json
    { "message": "Internal server error", "error": "<details>" }
    ```

#### Notes

- Passwords are hashed server-side before being stored.
- JWTs are signed using the environment variable `JWT_SECRET`. Ensure it is set in your environment.
