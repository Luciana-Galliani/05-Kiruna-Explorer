# Docker Environment Documentation

This document provides an overview of the Docker environment for the Kiruna Explorer project. It includes descriptions of the Dockerfiles for the client and server, as well as the `docker-compose.yml` file.

## Docker Compose

The `docker-compose.yml` file is used to define and run multi-container Docker applications. In this project, it orchestrates the **client** **server** containers and the **mysql** containers, ensuring they can communicate with each other and are started in the correct order. The file specifies the services, networks, and volumes required for the application.

## Client Dockerfile

The Client Dockerfile is responsible for building the Docker image for the client-side application. It includes the necessary instructions to:

- Set up the base image
- Install dependencies
- Copy the application code into the image
- Build the client application
- Specify the command to run the client application

## Server Dockerfile

The Server Dockerfile is responsible for building the Docker image for the server-side application. It includes the necessary instructions to:

- Set up the base image
- Install dependencies
- Copy the application code into the image
- Set environment variables
- Specify the command to run the server application

## Docker Compose Configuration

The `docker-compose.yml` file includes the following key sections:

- **Services**: Defines the client, server and mysql services, including the build context, Dockerfile location, ports, and environment variables (username and password for mysql user).
- **Networks**: Specifies the network configuration to enable communication between the client and server containers.
- **Volumes**: Defines any volumes needed for persistent storage.

By using Docker Compose, you can easily manage and deploy the entire application stack with a single command.

## Command to start the application

**Note**: before start with all the follow command it is needed to install Docker on your machine (Docker desktop is the best choice).

In order to run the application it is needed this few command:

- First, on the server folder run `npm uninstall bcrypt` (this is needed for the different installation of the packet on windows or linux env)
- Return on the main folder of the project and run the followin command in order
  - `docker-compose build` is needed to create a fresh image from the Dockerfiles (server and client)
  - `docker-compose up app server` is the command that allow to start the entire application

### Test environment

If you want to run the **UNIT TEST**, you need to run the command `docker-compose run test`

**IMPORTANT**: every time you do change on the code, you need to re-build the application, in order to do this is needed to run the command build. There is an alternative command `docker-compose up --build` (this command do the run command and additionally re-build a new image of the application)

The set-up files (Dockerfiles and Docker-compose) are adjust for running correctly even if the mysql server is running on the host machine. In case of any problems on the port you can adjust the port number on this files.
Additionally the **.env** file is changed allowing the correct connection between DB and server.
