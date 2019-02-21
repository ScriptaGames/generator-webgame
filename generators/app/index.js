"use strict";
const Generator = require("yeoman-generator");
const yosay = require("yosay");
const slug = require("slug");
const mkdirp = require("mkdirp");
const path = require("path");

module.exports = class extends Generator {
  async prompting() {
    this.log(yosay(`Would you like to make a game?`));

    this.answers = await this.prompt([
      {
        type: "input",
        name: "gameName",
        message: "The name of your game:",
        validate: answer => (/.+/.test(answer) ? true : "Name can't be empty.")
      },

      // {
      //   type: "input",
      //   name: "shortName",
      //   message: "Your game's shortname ",
      //   default: answers => slug(answers.fullName, { lower: true }),
      // },

      {
        type: "list",
        name: "lib",
        message: "Game engine",
        choices: [
          {
            name: "Phaser 3",
            value: "phaser"
          },
          {
            name: "Phaser 2 (CE)",
            value: "phaser-ce"
          },
          {
            name: "three.js",
            value: "three"
          },
          {
            name: "p5.js",
            value: "p5"
          },
          {
            name: "none (plain JS)",
            value: "plain"
          }
        ]
      }
    ]);
  }

  async writing() {
    // Sneak the directory name into the answers object, shhhh...
    this.answers.dirName = slug(this.answers.gameName, { lower: true });

    await mkdirp(this.answers.dirName);

    // copy all files, with templating
    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationPath(this.answers.dirName),
      this.answers
    );

    // copy dotfiles
    this.fs.copyTpl(
      this.templatePath("**/.*"),
      this.destinationPath(this.answers.dirName),
      this.answers,
      {
        globOption: { dot: true }
      }
    );

    // copy the lib-specific game.js into position
    this.fs.copyTpl(
      this.templatePath(path.join("src", `game-${this.answers.lib}.js`)),
      this.destinationPath(path.join(this.answers.dirName, "src", "game.js")),
      this.answers
    );

    // copy any lib-specific assets into position
    this.fs.copyTpl(
      this.templatePath(path.join("src", `assets-${this.answers.lib}`)),
      this.destinationPath(path.join(this.answers.dirName, "src", "assets")),
      this.answers
    );

    // remove the lib-specific versions of files
    this.fs.delete(path.join(this.answers.dirName, "src", "game-*.js"));
    this.fs.delete(path.join(this.answers.dirName, "src", "assets-*", "**"), { deep: true });
  }

  install() {
    process.chdir(this.answers.dirName);

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }

  end() {
    this.log(`Your webgame is ready!

To start up the development server:

  cd ${this.answers.dirName}
  npm start

Have fun, and if you have any issues, ask them here: https://github.com/ScriptaGames/create-webgame/issues`);
  }
};
