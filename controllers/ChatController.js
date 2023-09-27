const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "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",
});

async function getChatGPT(req, res) {
  const prompt = req.body.prompt;
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    const text = response?.choices[0]?.message?.content;
    return res.json({ message: text });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
}

module.exports = {
  getChatGPT,
};
