# AptiBook Web

This repository contains the AptiBook Web files, including the HTTP API and the Angular 4 frontend. It should be accessed with **IntelliJ Professional**.

This repository consists essentially of two parts: 

* The **frontend**, powered by **Angular 4** and **Webpack**, which consists of all the webpages, and talks to the API.
  * Runs on port **9000** 
  * Hosted with Webpack Dev Server
  * Can be launched with the `Frontend` run configuration.
* The **backend**, powered by **Spring Boot**, which hosts the API, talks to the database, handles authentication, etc.
  * Runs on port **8080** 
  * Can be launched with the `Backend` run configuration.
  
You can launch both the Frontend and the Backend at the same time with the `Full Stack` run configuration, which requires the `Multirun` IntelliJ plugin. Install this from Settings.
  
## Setup

### Full Stack

#### Multirun

To be able to start the `Full Stack` which will launch both the Frontend and Backend at the same time, you must install `Multirun` from the IntelliJ Plugins Repository, found in the Settings area.

### Backend

#### application-development.properties

Before you can start the `Backend` run configuration, you must create and populate the `application-development.properties` file in `src/main/resources`. This file is local to your computer and is ignored by git. It should never be committed, as it contains private and volatile information such as database connections, Liquibase behavior, etc.

Here is a sample `application-development.properties` file:

```properties
spring.datasource.url = jdbc:postgresql://util.aptitekk.com:2000/the_database
spring.datasource.username = the_username
spring.datasource.password = the_password
liquibase.drop-first=true
```

You should have been provided with credentials to access a development database. It follows this syntax:

* Database Name: aptibook_dev# (Where # is your unique database number)
* Database Username: aptibook (Same for all databases)

Once the file is created, you should be able to start the Backend run configuration. Watch out for any database connection errors on startup.

### Frontend

Before you can start the `Frontend` run configuration, you must install the required packages from `npm`. If you do not have `npm` installed, download `node` (which comes with `npm`) by going [here](https://nodejs.org/en/). Any version should work, the LTS is recommended. 

Once `npm` is installed (verify by running `npm --version` in the Terminal), open the Terminal window at the bottom of the IDE and run `npm install`. This may take a while.

After the dependencies are installed, they will show up in the `node_modules` directory, which is local to your computer and will not be committed. You can now start the Frontend run configuration.