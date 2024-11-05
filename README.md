# Project name : "Kiruna Explorer"

## Group: 5

## React Client Application Routes

- connections route (retrive the connections between documents)
- documents route (retrive all the documents, and give the possibility to add and modify them)
- stakeholders route (retrive all the stakeholders)
- users route : used fot login and register (the auth is managed with token)

## Database Tables

- **Users**
- **Documents**
  - id,
  - title:STRING,
  - scaleType:ENUM (Text, Concept, Plan, Blueprints/actions),
  - scaleValue?:STRING (if scaleType = Plan),
  - issuanceDate:DATE,
  - type:ENUM (Design Document, Informative Document...),
  - language?:STRING,
  - pages?:STRING,
  - descriptions:STRING
- **Stakeholders**
  - id,
  - name:ENUM,
  - color:STRING (hex color like "#09ABCD")
- **Connections**
  - relationship:ENUM,
  - sourceDocumentId,
  - targetDocumentId

## Main React Components

## Users Credentials

- username, password (plus any other requested info)

## License

This project is licensed under the Unlicense. See the [LICENSE](./LICENSE) file for details
