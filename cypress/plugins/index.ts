const { isFileExist } = require("cy-verify-downloads");

module.exports = (on: any) => {
  on("task", { isFileExist });
};
