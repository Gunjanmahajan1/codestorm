const chalk = require("chalk");

const getTime = () => new Date().toISOString();

/* -------------------- LOG LEVELS -------------------- */
exports.info = (message) => {
  console.log(
    chalk.blue(`[INFO] ${getTime()} - ${message}`)
  );
};

exports.success = (message) => {
  console.log(
    chalk.green(`[SUCCESS] ${getTime()} - ${message}`)
  );
};

exports.warn = (message) => {
  console.log(
    chalk.yellow(`[WARN] ${getTime()} - ${message}`)
  );
};

exports.error = (message) => {
  console.log(
    chalk.red(`[ERROR] ${getTime()} - ${message}`)
  );
};
