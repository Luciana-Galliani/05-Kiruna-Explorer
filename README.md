# Project name : "Kiruna Explorer"

## Group: 5

## React Client Application Routes

## API Server

## Database Tables

-   **Users**
-   **Documents**
    -   id,
    -   title:STRING,
    -   scaleType:ENUM (Text, Concept, Plan, Blueprints/Action),
    -   scaleValue?:STRING (if scaleType = Plan),
    -   issuanceDate:DATE,
    -   type:ENUM (Design Document, Informative Document...),
    -   language?:STRING,
    -   pages?:STRING,
    -   descriptions:STRING
-   **Stakeholders**
    -   id,
    -   name:ENUM,
    -   color:STRING (hex color like "#09ABCD")
-   **Connections**
    -   relationship:ENUM,
    -   sourceDocumentId,
    -   targetDocumentId

## Main React Components

## Users Credentials

-   username, password (plus any other requested info)
-   username, password (plus any other requested info)
