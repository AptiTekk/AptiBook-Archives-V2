/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

node {
    def herokuAppName = "aptitekk-aptibook"
    def jenkinsUrl = "https://dev.aptitekk.com/jenkins/"
    def liveUrl = "https://aptibook.aptitekk.com/"
    def pingUrl = "https://aptibook.aptitekk.com/ping"
    def mvnHome = tool "Maven"
    def nodeJsHome = tool "NodeJS"
    env.PATH = "${mvnHome}/bin:${nodeJsHome}/bin:${env.PATH}"

    try {
        stage "Checkout"
        slackSend color: "#4272b7", message: "[Job ${env.BUILD_NUMBER}] A new ${env.JOB_NAME} Pipeline build is starting..."
        checkoutFromGit()

        stage "Test"
        runTests()
        slackSend color: "good", message: "[Job ${env.BUILD_NUMBER}] All tests for the ${env.JOB_NAME} Pipeline have passed. Ready to deploy to Production."

        changeVersion(env.BUILD_NUMBER)

        stage "Deploy Approval"
        if (!getDeploymentApproval(jenkinsUrl)) {
            echo "Aborted by User."
            slackSend color: "warning", message: "[Job ${env.BUILD_NUMBER}] The ${env.JOB_NAME} Pipeline has been aborted by the user."
            return
        }

        stage "Deploy to Production"
        slackSend color: "#4272b7", message: "[Job ${env.BUILD_NUMBER}] Deploying AptiBook to Heroku..."
        deployToProduction(herokuAppName)

    } catch (err) {
        slackSend color: "danger", message: "[Job ${env.BUILD_NUMBER}] An Error occurred during the ${env.JOB_NAME} Pipeline."
        error err
    }
}

def checkoutFromGit() {
    def branch = "stable"
    def url = "ssh://git@util.aptitekk.com:2005/ab/aptibook-angular.git"
    def credentialsId = "542239bb-3d63-40bc-9cfa-e5ed56a1fc5b"

    checkout([$class                           : "GitSCM",
              branches                         : [[name: "*/${branch}"]],
              browser                          : [$class: 'BitbucketWeb', repoUrl: 'https://dev.aptitekk.com/git/projects/AB/repos/aptibook-angular/browse'],
              doGenerateSubmoduleConfigurations: false,
              extensions                       : [],
              submoduleCfg                     : [],
              userRemoteConfigs                : [[credentialsId: "${credentialsId}", url: "${url}"]]
    ])
}

def runTests() {
    sh "npm i"
    sh "npm run-script heroku-postbuild"
    sh "mvn clean install -P testing"
}

def changeVersion(buildNumber) {
    sh 'mvn versions:set -DnewVersion="`date +%Y.%m.%d`_' + buildNumber + '"'
    sh 'mvn versions:commit'
    sh "git commit -a -m 'Jenkins Automatic Version Change'"
}

def deployToProduction(herokuAppName) {
    // Remove all files except for what is needed by maven to build the jar. Web-packing will be done on the jenkins server.
    sh "find . " +
            "-type d " +
            "-not -name src " +
            "-not -name .git " +
            "-not -name jenkins " +
            "-or -type -f " +
            "-not -name pom.xml " +
            "-not -name Procfile " +
            "-not -name currentVersion " +
            "-exec rm -irf {} \\;"

    // Force add all files, even if .gitignored
    sh "git add src/main/webapp/packed/* -f"

    // Commit
    sh "git commit -a -m 'Jenkins Automatic Add Packed'"

    // Add the heroku git remote to the git repo
    sh "heroku git:remote --app ${herokuAppName}"

    // Push to heroku
    sh "git push heroku HEAD:master -f"

    // Enable heroku Maintenance Mode
    sh "heroku maintenance:on --app ${herokuAppName}"

    // Sleep for one minute to allow heroku to boot
    sleep 60

    // Define the version variable based on what was pre-determined.
    sh 'mvn help:evaluate -Dexpression=project.version|grep -Ev \'(^\\[|Download\\w+:)\' > currentVersion'
    def version = readFile "currentVersion"

    // Send Slack messages
    slackSend color: "good", message: "[Job ${env.BUILD_NUMBER}] ${herokuAppName} version ${version} has been deployed."
    slackSend color: "#4272b7", message: "[Job ${env.BUILD_NUMBER}] Don't forget to disable maintenance mode."
}

boolean getDeploymentApproval(jenkinsUrl) {
    try {
        slackSend color: "#4272b7", message: "[Job ${env.BUILD_NUMBER}] Please approve or abort the pending deployment at ${jenkinsUrl}."
        input message: "Please approve when you are ready to deploy.", ok: "Approve"
        return true
    } catch (ignored) {
        return false
    }
}