"use strict";
const Generator = require("yeoman-generator");
const yosay = require("yosay");
const slug = require("slug");
const mkdirp = require("mkdirp");

module.exports = class extends Generator {
  async prompting() {
    this.log(yosay(`Would you like to generate a game?`));

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
            value: "none"
          }
        ]
      }
    ]);
  }

  async writing() {
    // Sneak the directory name into the answers object, shhhh...
    this.answers.dirName = slug(this.answers.gameName, { lower: true });

    await mkdirp(this.answers.dirName);

    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationPath(this.answers.dirName),
      this.answers,
      {
        globOption: { dot: true }
      }
    );
  }

  install() {
    process.chdir(this.answers.dirName);

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};
