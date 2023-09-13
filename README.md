# Majelan Node Technical Test

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

You will have to create the endpoints to manage medias and programs. You can find the models in the `api` package, in the `entities` folder. Here are the features you'll need to implement:

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

