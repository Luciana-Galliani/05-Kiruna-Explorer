# API Server

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

## Documents

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
            "otherDocumentType": null,
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
            "otherStakeholderName": null,
            "connections": [
                {
                    "id": 5,
                    "relationship": "Update",
                    "targetDocument": {
                        "id": 6,
                        ...,
                        "description": "This document is ...",
                    }
                },
                {
                    "id": 7,
                    "relationship": "Prevision",
                    "targetDocument": {
                        "id": 3,
                        ...,
                        "description": "The development plan ...",
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

### Authenticated

-   POST /api/documents

    Header:

    **Authorization: Bearer <your_jwt_token>**

    Body:

    ```json
    {
        "title": "Sample Document",
        "scaleType": "Plan",
        "scaleValue": "1:1.000",
        "issuanceDate": "2014-02-14T00:00:00.000Z",
        "type": "Other",
        "otherDocumentType": "New doc type", (if type is "Other")
        "language": "English",
        "pages": "12",
        "description": "This is a description",
        "stakeholders": [{ "id": 1 }, { "id": 2 }],
        "areaId": 1,
        "otherStakeholderName": "new stakeholder", (if one the stakeholders selected is "Other")
        "connections": [{"documentId": 1, "relationship": "Prevision"}, ...]
    }
    ```

    Response:

    ```json
    {
        "document": {
            "id": 11,
            "title": "Sample Document",
            "scaleType": "Plan",
            "scaleValue": "1:1.000",
            "issuanceDate": "2014-02-14T00:00:00.000Z",
            "type": "Other",
            "otherDocumentType": "new doc type",
            "language": "English",
            "pages": "12",
            "description": "This is a description",
            "allMunicipality": null,
            "latitude": null,
            "longitude": null,
            "stakeholders": [
                {
                    "id": 1,
                    "name": "Citizens",
                    "color": "#FFFF00"
                },
                {
                    "id": 6,
                    "name": "Other",
                    "color": "#FFFF00"
                }
            ],
            "area": {},
            "otherStakeholderName": "new stakeholder",
            "connections": [
                {
                    "id": 11,
                    "relationship": "Prevision",
                    "targetDocument": {
                        "id": 1,
                        ...,
                        "longitude": null
                    }
                },
                ...,
            ]
        }
    }
    ```

-   PUT /api/documents/:id

    Header:

    **Authorization: Bearer <your_jwt_token>**

    Body:

    ```json
    {
        "title": "Sample Document",
        "scaleType": "Plan",
        "scaleValue": "1:1.000",
        "issuanceDate": "2014-02-14T00:00:00.000Z",
        "type": "Other",
        "otherDocumentType": "New doc type", (if type is "Other")
        "language": "English",
        "pages": "12",
        "description": "This is a description",
        "stakeholders": [{ "id": 1 }, { "id": 2 }],
        "areaId": 1,
        "otherStakeholderName": "new stakeholder", (if one the stakeholders selected is "Other")
        "connections": [{"documentId": 1, "relationship": "Prevision"}, ...]
    }
    ```

    Response:

    ```json
    {
        "document": {
            "id": 11,
            "title": "Sample Document",
            "scaleType": "Plan",
            "scaleValue": "1:1.000",
            "issuanceDate": "2014-02-14T00:00:00.000Z",
            "type": "Other",
            "otherDocumentType": "new doc type",
            "language": "English",
            "pages": "12",
            "description": "This is a description",
            "allMunicipality": null,
            "latitude": null,
            "longitude": null,
            "stakeholders": [
                {
                    "id": 1,
                    "name": "Citizens",
                    "color": "#FFFF00"
                },
                {
                    "id": 6,
                    "name": "Other",
                    "color": "#FFFF00"
                }
            ],
            "area": {},
            "otherStakeholderName": "new stakeholder",
            "connections": [
                {
                    "id": 11,
                    "relationship": "Prevision",
                    "targetDocument": {
                        "id": 1,
                        ...,
                        "longitude": null
                    }
                },
                ...,
            ]
        }
    }
    ```

## Users

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

## Kiruna

-   GET /api/kiruna/boundaries

    Response:

    ```json
    {
        "type": "FeatureCollection",
        "name": "l2_SE_2584",
        "crs":
            {
                "type": "name",
                "properties":
                    {
                        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                    }
            },
        "features": [
            {
                "type": "Feature",
                "properties":
                {
                    "stat_id": "l2_SE_2584",
                    "pnm": "Kiruna Municipality"
                },
                "geometry":
                {
                    "type": "MultiPolygon",
                    "coordinates": [
                        [
                            [
                                [21.3673, 67.4734],
                                [21.3675, 67.4737],
                                ...
                            ]
                            ...
                        ]
                    ]
                }
            }
        ]
    }
    ```

    ## Areas
-   POST /api/areas

  Body:

  ```json
{
    "name": "new area",
    "geojson": {
        "type": "Polygon",
        "coordinates": [
            [
                [2.3522, 48.8566],
                [2.3532, 48.8566],
                [2.3532, 48.8576],
                [2.3522, 48.8576],
                [2.3522, 48.8566]
            ]
        ]
    }
}
```

Response: 
{
    "area": 
        {
            "id": 1,
            "name": "City center",
            "geojson": {},
            "centerLat": 75.12,
            "centerLon": 32,21
        }
}
        
    
  

-   GET /api/areas

    Response:

    ```json
    {
        "areas": []
    }
    ```
