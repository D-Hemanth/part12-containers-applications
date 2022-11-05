# Each RUN, COPY, and ADD instruction in the Dockerfile adds a layer to the image, and you need to remember to clean up any artifacts you don’t need before moving on to the next layer to keep the image size, build time down & reduce risk of vulnerabilities
# Or use multi-stage builds, a tried and true solution for the above problems

# First stage FROM is now a stage called test-stage
FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=true npm test

# The second stage FROM is now a stage called build-stage
FROM node:16 AS build-stage

WORKDIR /usr/src/app

# https://stackoverflow.com/questions/19537645/get-environment-variable-value-in-dockerfile to pass env variable during build & run stages
ARG REACT_APP_BACKEND_URL

ENV REACT_APP_BACKEND_URL http://localhost:3000

COPY --from=test-stage /usr/src/app /usr/src/app/

RUN npm run build

# using serve to serve the static build files also works: $ docker run -p 4000:3000 todo-frontend
# RUN npm install -g serve

# CMD ["serve", "build"]

# This is the third stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html