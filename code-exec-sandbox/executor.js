const { exec } = require("child_process");
const fs = require("fs");

function runCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
}

async function execute(code, lang) {
  if (lang === "python") {
    fs.writeFileSync("solution.py", code);
    return await runCommand("python3 solution.py");
  }

  if (lang === "javascript") {
    fs.writeFileSync("solution.js", code);
    return await runCommand("node solution.js");
  }

  if (lang === "java") {
    fs.writeFileSync("Solution.java", code);
    await runCommand("javac Solution.java");
    return await runCommand("java Solution");
  }
}

module.exports = { execute };
