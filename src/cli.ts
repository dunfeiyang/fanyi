import { translate } from "./main";

const { Command } = require("commander");
const pkg = require("../package.json");

const program = new Command();

program
  .version(pkg.version)
  .name("fy")
  .usage("<English>")
  .arguments("<English>")
  .action(function(word: string) {
    translate(word);
  });

program.parse(process.argv);
