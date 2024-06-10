pipeline {
    agent any

    /* parameters {
        string(
            name: 'AWS_ACCOUNT_ID',
            description: 'Account ID of the AWS you want to build'
        ),
        string(
            name: 'AWS_DEFAULT_REGION',
            description: 'Name of the Region you want to build'
        ),
        string(
            name: 'BRANCH_NAME',
            description: 'Name of the branch you want to build'
        )

    }*/

    environment {
        AWS_ACCOUNT_ID="979022608152"
        AWS_DEFAULT_REGION="us-west-1"
        BRANCH_NAME="main"
        FRONTEND_REPO_NAME="abhi-frontend"
        BACKEND_REPO_NAME="abhi-backend"
        FRONTEND_REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${FRONTEND_REPO_NAME}"
        BACKEND_REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${BACKEND_REPO_NAME}"
        DEPLOY_SERVER_IP="50.18.117.234"
        GIT_REPO_URL="https://github.com/namdevabhi846/real-estate-management.git"
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    sh "git clone ${GIT_REPO_URL} real-estate"
                    dir('real-estate') {
                        sh "git checkout ${BRANCH_NAME}"
                        sh "ls -a"
                    }
                }
            }
        }
 
        stage('Logging into AWS ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    sh "docker images -a -q | xargs docker rmi -f || true"
                }
            }
        }
 
        // Building Docker images
        stage('Building image') {
            steps{
                script {
                    env.git_commit_sha = sh(script: 'git rev-parse --short=6 HEAD', returnStdout: true).trim( )
                    sh "docker build -t ${FRONTEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha} ."
                    sh "docker build -t ${BACKEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha} ."
                }
            }
        }
 
        // Uploading Docker images into AWS ECR
        stage('Pushing to ECR') {
            steps{ 
                script {
                    sh "docker push ${FRONTEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}"
                    sh "docker push ${BACKEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}"
                }
            }
        }

        //Creating container 
        stage('creating container for real-estate-managemant') {
            steps{ 
                script {
                    sh "ssh ubuntu@${DEPLOY_SERVER_IP} /home/ubuntu/login-ecr.sh"             
                    sh "ssh ubuntu@${DEPLOY_SERVER_IP} sudo docker rm -f ${FRONTEND_REPO_NAME}-${BRANCH_NAME} || true"
                    sh "ssh ubuntu@${DEPLOY_SERVER_IP} sudo docker rm -f ${BACKEND_REPO_NAME}-${BRANCH_NAME} || true"
                    sh "ssh ubuntu@${DEPLOY_SERVER_IP} sudo docker images -a -q | xargs docker rmi -f || true"
                    sh "ssh ubuntu@${DEPLOY_SERVER_IP} sudo docker run -itd --name ${FRONTEND_REPO_NAME}-${BRANCH_NAME} -p 4200:4200 --restart always ${FRONTEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}"
                    sh "ssh ubuntu@${DEPLOY_SERVER_IP} sudo docker run -itd --name ${BACKEND_REPO_NAME}-${BRANCH_NAME} -p 8000:8000 --restart always ${BACKEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}"
                }
            }
        }
    }
}
