FROM node:8-stretch

 

# Change working directory


WORKDIR "/app"

 

# Update packages and install dependency packages for services


RUN apt-get update \


&& apt-get dist-upgrade -y \


&& apt-get clean \


&& echo 'Finished installing dependencies'

 

# Install npm production packages
COPY package.json /app/
RUN cd /app; npm install --production
RUN npm install -g nodemon
COPY . /app
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
EXPOSE 30258
CMD ["npm", "run", "build-client"]
CMD ["npm", "run", "build-server"]