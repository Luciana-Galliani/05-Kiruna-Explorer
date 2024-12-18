# Project name : "Kiruna Explorer"

## Group: 5

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

## Main React Components

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
