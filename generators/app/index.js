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
                validate: answer =>
                    /.+/.test(answer) ? true : "Name can't be empty."
            },

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
            },

            {
                type: "confirm",
                name: "phaserCeTiled",
                message: "Include Tiled map support?",
                when: answers => answers.lib === "phaser-ce"
            }
        ]);
    }

    async writing() {
        // Sneak the directory name into the answers object, shhhh...
        this.answers.slugName = slug(this.answers.gameName, { lower: true });

        await mkdirp(this.answers.slugName);

        // Copy all files, with templating
        this.fs.copyTpl(
            this.templatePath("**/*"),
            this.destinationPath(this.answers.slugName),
            this.answers
        );

        // Copy dotfiles
        this.fs.copyTpl(
            this.templatePath("**/.*"),
            this.destinationPath(this.answers.slugName),
            this.answers,
            {
                globOption: { dot: true }
            }
        );

        // Copy the lib-specific game.js into position
        this.fs.copyTpl(
            this.templatePath(path.join("src", `game-${this.answers.lib}.js`)),
            this.destinationPath(
                path.join(this.answers.slugName, "src", "game.js")
            ),
            this.answers
        );

        // Copy any lib-specific assets into position
        this.fs.copy(
            this.templatePath(path.join("src", `assets-${this.answers.lib}`)),
            this.destinationPath(
                path.join(this.answers.slugName, "src", "assets")
            )
        );

        // Remove the lib-specific versions of files
        this.fs.delete(path.join(this.answers.slugName, "src", "game-*.js"));
        this.fs.delete(
            path.join(this.answers.slugName, "src", "assets-*", "**"),
            { deep: true }
        );
    }

    install() {
        // Install deps
        process.chdir(this.answers.slugName);
        this.installDependencies({
            npm: true,
            bower: false,
            yarn: false
        });
    }

    end() {
        // Initialize git
        this.spawnCommandSync("git", ["init"]);
        this.spawnCommandSync("git", ["add", "--all"]);
        this.spawnCommandSync("git", [
            "commit",
            "-m",
            "initial commit from 'yo webgame'"
        ]);

        this.log(`Your webgame is ready!

To start up the development server:

  cd ${this.answers.slugName}
  npm start

Have fun, and if you have any issues, ask them here: https://github.com/ScriptaGames/create-webgame/issues`);
    }
};
