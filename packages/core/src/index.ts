import { readFile } from "fs/promises";
import path from "path";
import chalk from "chalk";
import { ConfigObjectType } from "@autodocument/shared";

const getConfigFile = async () => {
  const currentExecPath = process.cwd();
  // TODO: 做开发环境以及生产环境的区分
  const configFilePath = path.resolve(
    currentExecPath,
    "../../examples/parser-tsInterface/autoDoc.config.json"
  );
  const configObjectJson = await readFile(configFilePath, "utf8").catch((e) => {
    console.log(chalk.red("error"), e); //TODO: error message
  });
  if (!configObjectJson) {
    return;
  }
  const configObject: ConfigObjectType = JSON.parse(configObjectJson);
  return configObject;
};

const validateConfigFile = (configObject: ConfigObjectType) => {
  const { parser, write } = configObject;
  let validate = true;

  if (!parser) {
    validate = false;
    console.log(chalk.red(""), "/n"); //TODO:error message
  }
  if (!write) {
    validate = false;
    console.log(chalk.red(""), "/n"); //TODO:error message
  }

  if (!parser.entry) {
    validate = false;
    console.log(chalk.red(""), "/n"); //TODO:error message
  }

  if (!Array.isArray(parser.plugins) || parser.plugins.length <= 0) {
    validate = false;
    console.log(chalk.red(""), "/n"); //TODO:error message
  }

  if (!write.end) {
    validate = false;
    console.log(chalk.red(""), "/n"); //TODO:error message
  }

  if (!Array.isArray(write.plugins) || write.plugins.length <= 0) {
    validate = false;
    console.log(chalk.red(""), "/n"); //TODO:error message
  }

  return validate;
};

const main = async () => {
  console.log("start");
  const configObject = await getConfigFile();
  if (!configObject) {
    return;
  }

  const validateResult = validateConfigFile(configObject);
  if (!validateResult) {
    return;
  }

  console.log("result", configObject, validateResult);
  return;
  // const parserPlugins = configObject.parser.plugins || [];

  // const parserResults = await Promise.all(parserPlugins.map(async(parserPlugin)=>{
  //   const plugin = await import(parserPlugin.plugin);
  //   return plugin(parserPlugin,configObject);
  // }))

  // const writePlugins = configObject.parser.plugins || [];

  // Promise.all(writePlugins.map(async(writePlugin)=>{
  //   const plugin  = await import(writePlugin.plugin);
  //   return plugin(writePlugin,parserResults,configObject);
  // }))
};

main();
