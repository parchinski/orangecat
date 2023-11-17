const fs = require("fs");
const path = require("path");

// Create log folder if it doesn't exist
if (!fs.existsSync("../logs")) {
  fs.mkdirSync("../logs");
}

const setLogFile = () => {
  const datetime = new Date();
  const normalDate = datetime.toISOString().slice(0, 10);
  const logFile = path.join("../logs", `${normalDate}.log`);

  return logFile;
};

const info = (category, message) => {
  const logFile = setLogFile();

  const detailedLogMessage = `[${new Date().toLocaleString()}][INFO][${category}] ${message}\n`;
  const logMessage = `[INFO] ${message}`;

  console.log(logMessage);
  fs.appendFile(logFile, detailedLogMessage, function (err) {
    if (err) throw err;
  });
};

const error = (category, message, err) => {
  const logFile = setLogFile();

  const detailedLogMessage = `[${new Date().toLocaleString()}][ERR][${category}] ${message}\n`;
  const logMessage = `[ERR] ${message}`;

  console.error(logMessage);
  fs.appendFile(logFile, detailedLogMessage, function (err) {
    if (err) throw err;
  });
  if (err) {
    fs.appendFile(logFile, err.stack, function (err) {
      if (err) throw err;
    });
  }
};

module.exports = {
  info,
  error,
};
