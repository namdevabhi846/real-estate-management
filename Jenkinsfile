pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "637423400986"
        AWS_DEFAULT_REGION = "ap-south-1"
        BRANCH_NAME = "main"
        FRONTEND_REPO_NAME = "abhi-frontend"
        BACKEND_REPO_NAME = "abhi-backend"
        FRONTEND_REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${FRONTEND_REPO_NAME}"
        BACKEND_REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${BACKEND_REPO_NAME}"
        DEPLOY_SERVER_IP = "13.202.47.31"
        EMAIL_ADD = "abhishek.namdev.cn@gmail.com"
    }

    stages {
        stage('Logging into AWS ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    sh "docker images -a -q | xargs docker rmi -f || true"
                }
            }
        }

        stage('Building image') {
            steps {
                script {
                    env.git_commit_sha = sh(script: 'git rev-parse --short=6 HEAD', returnStdout: true).trim()
                    sh "docker build -t ${FRONTEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha} /var/lib/jenkins/real-estate-management/frontend"
                    sh "docker build -t ${BACKEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha} /var/lib/jenkins/real-estate-management/backend-fastify"
                }
            }
        }

        stage('Pushing to ECR') {
            steps {
                script {
                    sh "docker push ${FRONTEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}"
                    sh "docker push ${BACKEND_REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}"
                }
            }
        }

        stage('Creating container for real-estate-management') {
            steps {
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

   post {
    success {
        script {
            echo 'Sending success email...'
        }
        emailext body: 'Build succeeded. Your custom message here.',
                 subject: 'Jenkins Build Success Notification',
                 to: "${EMAIL_ADD}"
    }
    failure {
        script {
            echo 'Sending failure email...'
        }
        emailext body: 'Build failed. Your custom message here.',
                 subject: 'Jenkins Build Failure Notification',
                 to: "${EMAIL_ADD}"
    }
}
}



    
