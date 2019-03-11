# Use an official Node runtime as a parent image
FROM node:8

# Set the working directory to /app
WORKDIR /usr/src/app

#copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages specified in requirements.txt
RUN npm install

# Install any needed packages specified in requirements.txt
RUN npm install forever -g

#bundle app source
COPY . .

# Make port 3011 available to the world outside this container
EXPOSE 3011

# Run app.py when the container launches
CMD ["forever", "./server/index.js"]