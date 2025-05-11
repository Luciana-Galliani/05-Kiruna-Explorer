# Kiruna Explorer

Kiruna Explorer is an interactive platform that tells the story of Kiruna's relocation—a monumental endeavor to preserve the city as it adapts to mining activities and evolving urban needs. The application features historical records, urban planning documents, and cultural highlights, offering an engaging way to explore Kiruna's past, present, and future.

Developed by Team 5 of the Software Engineering II course at Politecnico di Torino during the academic year 2024-2025.

## Teaser Video
A video showing the execution of the Kiruna eXplorer system software.

Link: https://www.youtube.com/watch?v=iAWV1fb5a5I

## React Client Application Routes

-   Connections route : retrieve the connections types possible between documents
-   Documents route : retrive all the documents, and give the possibility to add and modify them
-   Stakeholders route : retrive all the stakeholders
-   Users route : used for login and register (the auth is managed with token)

## Database Tables

-   **Users**
    -   id,
    -   username:STRING,
    -   password:STRING
-   **Documents**
    -   id,
    -   title:STRING,
    -   scaleType:ENUM (Text, Concept, Plan, Blueprints/actions),
    -   scaleValue?:STRING (if scaleType = Plan),
    -   issuanceDate:DATE,
    -   type:ENUM (Design Document, Informative Document...),
    -   language?:STRING,
    -   pages?:STRING,
    -   descriptions:STRING,
    -   allMunicipality?:BOOLEAN,
    -   latitude?:DECIMAL(10,8),
    -   longitude?:DECIMAL(11,8)
-   **Stakeholders**
    -   id,
    -   name:ENUM,
    -   color:STRING (hex color like "#09ABCD")
-   **Connections**
    -   id,
    -   relationship:ENUM,
    -   sourceDocumentId,
    -   targetDocumentId


## Users Credentials

- Pre define user:
    - username: `urbanPlanner1`
    - password: `password`

**Note**: there are possibility to register a new user

## Deploy environment

For run this project in a deploy environment without have the code need to use the `docker-compose.deploy.yml` file.

The command for running are `docker-compose -f docker-compose.deploy.yml up -d`.

The web-app run on **localhost:5173**

## License

This project is licensed under the Unlicense. See the [LICENSE](./LICENSE) file for details
