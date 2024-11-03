## API Server

-   GET /api/connections

    Response:

```json
    { "connections": ["Direct Consequence", ...] }
```

-   GET /api/stakeholders

    Response:

```json
    { "stakeholders": [
        {
            "id": 1,
            "name": "LKAB",
            "color": "#000000"
        },
        ...
    ]}
```

-   GET /api/documents/:id

    Response:

    ```json
    {
        "document": {
            "id": 2,
            "title": "Detail plan for Bolagsomradet Gruvstadspark (18)",
            "scaleType": "Plan",
            "scaleValue": "1:8.000",
            "issuanceDate": "2010-10-20T00:00:00.000Z",
            "type": "Prescriptive Document",
            "language": "Swedish",
            "pages": "1-32",
            "description": "This is ...",
            "stakeholders": [
                {
                    "id": 2,
                    "name": "Municipality",
                    "color": "#FF0000"
                }
            ],
            "connectedDocuments": [
                {
                    "id": 1,
                    ...,
                    "description": "This document is ...",
                    "connection": {
                        "relationship": "Update"
                    }
                },
                {
                    "id": 3,
                    ...,
                    "description": "The development plan ...",
                    "connection": {
                        "relationship": "Collateral Consequence"
                    }
                }
            ]
        }
    }
    ```

-   GET /api/documents

    Response:

    ```json
    {
        "documents": [...(same form as previous get document by id)]
    }
    ```

-   POST /api/documents

    Body:

    ```json
    {
        "title": "Sample Document",
        "scaleType": "Plan",
        "scaleValue": "1:1.000",
        "issuanceDate": "2014-02-14T00:00:00.000Z",
        "type": "Technical Document",
        "language": "English",
        "pages": "12",
        "description": "This is a description",
        "stakeholders": [{ "id": 1 }, { "id": 2 }]
    }
    ```

    Response:

    ```json
    {
        "document": {
            "id": 4,
            ...,
            "description": "This is a description.",
            "stakeholders": [
                {
                    "id": 2,
                    "name": "Municipality",
                    "color": "#FFFFFF"
                },
                ...,
            ]
        }
    }
    ```

-   PUT /api/documents/:id

    Body:

    ```json
    {
        "title": "New Document",
        "scaleType": "Plan",
        "scaleValue": "1:1.000",
        "issuanceDate": "2014-02-14T00:00:00.000Z",
        "type": "Technical Document",
        "language": "English",
        "pages": "12",
        "description": "This is a new description",
        "stakeholders": [{ "id": 1 }, { "id": 2 }]
    }
    ```

    Response:

    ```json
    {
        "document": {
            "id": 4,
            ...,
            "description": "This is a new description.",
            "stakeholders": [
                {
                    "id": 2,
                    "name": "Municipality",
                    "color": "#FFFFFF"
                },
                ...,
            ]
        }
    }
    ```

-   POST /api/users/register

    Body:

    ```json
    {
        "username": "aUsername",
        "password": "aStrongPassword"
    }
    ```

    Response:

    ```json
    {
        "message": "User created",
        "user": "aUsername"
    }
    ```

-   POST /api/users/login

    Body:

    ```json
    {
        "username": "aUsername",
        "password": "aStrongPassword"
    }
    ```

    Response:

    ```json
    {
        "message": "Login successful",
        "token": "eyJhbGciOi...qDUpt4E"
    }
    ```
