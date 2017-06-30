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

## Usage

### Backend

To run the backend server, select the Backend run configuration and start the **debugger**. 

You want to use the debugger because it allows you to hot-swap changes to the code without having to reboot the entire server. For example, after changing the contents of a method, you can click the "make" button (to the left of the run configuration dropdown) and the changes will be re-loaded. This makes it super easy to make changes to REST API methods without rebooting the server. _Note: This does not work when you create new methods, fields, or classes, or rename any methods/fields/classes etc... Basically, it only works when modifying method contents._ 

The server will start on port **9000**.

### Frontend

To run the frontend development server, select the Frontend run configuration and start the **debugger**. The server **will not run** if not in debugging mode. You can then access the webpage at:

http://demo.localhost:8080

When you make any changes to the typescript/html/css files, the web browser will automatically reload the changes for you. API requests (those to /api) are forwarded to port 9000 where the Backend server must be running.
