const { executeCode } = require("../services/codeExecService");

exports.runCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    // ✔ Input validation
    if (!code || !language) {
      return res.status(400).json({
        error: "Code and language are required"
      });
    }

    const output = await executeCode(code, language);

    res.json(output);

  } catch (err) {
    console.error("Code Execution Error →", err.message);
    res.status(500).json({ error: "Code execution failed" });
  }
};
