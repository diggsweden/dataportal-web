const { isFileExist } = require("cy-verify-downloads");

// biome-ignore lint/suspicious/noExplicitAny: Unknown type
module.exports = (on: any) => {
  on("task", { isFileExist });
};
