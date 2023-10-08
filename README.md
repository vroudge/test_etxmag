# Majelan Node Technical Test

-------------------------------------
## Introduction

This is a technical test for the Majelan Node position. It is a simple web app that allows users to manage their audio content.

The app is composed of one domain, the "program creation".

I've written it using the bootstrap function that was provided to me, and I've added a few things to make it work.
- Nestjs as a framework. I could infer from the bootstrap function using Fastify that is probably the direction you wanted me to go in but quite honestly writing a server from scratch is a bit of a pain and I don't think it's a good use of my time, or yours.
I figured I might be able to show you something more interesting ; and more entertaining as well. 
- Graphql. Honestly, I've been using it for the past 5 years but never got around writing some close to the Relay specification, so this is my shot at it.
- Typeorm. I've been using it for the past 5 years as well, and I'm quite fond of it. Code-first, clean and readable entities, migrations, and a lot of other things that make it a great ORM ; and it's not even that slow.

**So what do we have here? And how do I check it?**

- A fastify server, with a graphql endpoint.
- `yarn start` will run the server
- then navigate to `http://localhost:8080/graphql` to access the graphql interface.
- You can check the docs there for the endpoints, plus test my queries as you wish.

What I didn't take the time to do, because I guessed it wouldn't be that interesting to you:

- Tests. I've hand-tested pretty much everything through the interface. It's all a bit messy, unperfect, but it works. It'd probably take me a few hours to write the tests. If you wonder whether I can write tests, I can show you some of my work.
- Clean DTOs. My output types are sometimes a bit messy in the Graphql resolvers but I'd rather fit the spec than take too much time writing DTOs.
- Super in-depth documentation. I've written a few comments here and there but I didn't take the time to write a full documentation. I'm not sure it's necessary for a technical test, but I'd be happy to tell you everything over a call.
- The migrations utils. I've set the database to synchronize on app-startup so migrations run every time. 

-------------------------------------
## Getting Started

Fork this repository to work on it as you would usually do. Once you're done, send us the URL so we can take a look!

### Running the thing

This test uses Yarn, along with Docker to get you running quickly with a MySQL Database. You can start the containers and get running with the following commands:

```bash
docker compose up -d
yarn start
```

The api service will run on port 8080, the web service will run on port 3000.
Open http://localhost:3000 with your browser to access the web app.

## What you'll have to do
Clients want to organise their own content. They have audio files which they want to upload and organise into programs. They also want to be able to edit and delete their content.

You will have to create the endpoints to manage medias and programs. You will find the models for each entity along in the sections below.

#### Medias
A media has a name, a file, a duration, and a description.
- Create a media (don't upload anything for real, just create a fake audio file or use a dummy URL)
- Edit a media
- Delete a media
- See all the medias on a page (with pagination)

#### Programs
A program has a name, a cover image (you can use a dummy URL), and a description.
- Create a program
- Edit a program
- Delete a program
- See all the programs on a page (with pagination)

#### Rules
- A program can contain between 0 and infinity medias.
- A media cannot be in more than one program.
- The order of medias may matter.


### Requirements
- You must use the boilerplate code as a base for your work. You can add any other dependency you need.
- You must deliver all the features required.
- You must test your endpoints to make sure they work as expected. How you test them is up to you.

### Bonus points
- You can add any extra feature that you'd like to see in this app. Be creative!
- You can also add any extra quality of life improvement to the app or code (linter, formatter...)

