/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

node {
    def mvnHome = tool "Maven"
    def nodeJsHome = tool "NodeJS"
    env.PATH = "${mvnHome}/bin:${nodeJsHome}/bin:${env.PATH}"

    try {
        stage "Checkout"
        slackSend color: "#4272b7", message: "[Job ${env.BUILD_NUMBER}] A new ${env.JOB_NAME} Pipeline build is starting..."
        checkoutFromGit()

        stage "Test"
        runTests()
        slackSend color: "good", message: "[Job ${env.BUILD_NUMBER}] All tests for the ${env.JOB_NAME} Pipeline have passed."

    } catch (err) {
        slackSend color: "danger", message: "[Job ${env.BUILD_NUMBER}] An Error occurred during the ${env.JOB_NAME} Pipeline."
        error err
    }
}

def checkoutFromGit() {
    def branch = "master"
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
}