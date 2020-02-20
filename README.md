<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src=".github/logo.png" width="300px" />
</h1>

<h3 align="center">
  FastFeet Challenge.
</h3>

<p>Esse desafio faz parte do Desafio Final do bootcamp da Rocketseat, que é uma aplicação completa (Back-end, Front-end e Mobile).</p>

<p align="center">
   <a align="center" href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  </a>
</p>

## :rocket: About the challenge

The application is an app for a fictional carrier, FastFeet.

### **Technologies**

- ⚡ **Express** - Fast, flexible and minimalist web framework for Node.js;
- **Sucrase** + **Nodemon**;
- 💖 **ESLint** + **Prettier** + **EditorConfig**;
- 💾 **Sequelize** - SQL dialect ORM for Node.js;
- 🔑 **Redis** — key-value data model
- :closed_lock_with_key: **JWT** - Json Web Token;
- ⌨️ **YUP** - is a JavaScript schema builder for value parsing and validation.
- 📧 **Nodemailer** - Send e-mails with Node.JS

## Dependencies

- [Node.js](https://nodejs.org/en/) 12.14.0 ou >
- [Yarn](https://yarnpkg.com/pt-BR/docs/install)
- [Docker](https://www.docker.com/)

## Prerequisites

To run this server you will need two containers running on your machine.

To do so, you will need to run the following commands:

- `docker run --name fastfeet -e POSTGRES_PASSWORD=docker -p 5433:5432 -d postgres:11`;
- `docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine`;

_Remember: If you restart your machine, you will need to start again the server with `docker start <container_id>`._

If you are using Insomnia as an http client, import the file: [![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=FastFeet&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fwalefe%2FFastFeet%2Fmaster%2FInsomnia.json)

## **Getting started**

_Before you run this application you need to make sure the [server](https://github.com/walefe/FastFeet) is running!_.

1. Clone this repo using `https://github.com/walefe/FastFeet.git`
2. Move to the appropriate directory: `cd FastFeet`.<br />
3. Run `yarn` to install dependencies.<br />
4. Run `yarn dev` to see the example app at `http://localhost:3333`.
