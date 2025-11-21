const { executeCode } = require("../services/codeExecService");

exports.runCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    const output = await executeCode(code, language);

    res.json(output);
  } catch (err) {
    res.status(500).json({ error: "Code execution failed" });
  }
};
