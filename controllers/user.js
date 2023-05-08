const MESSAGE = require("../models/gpt");
const HttpError = require("../helper/HttpError");

const createGpt = async (req, res, next) => {
  const openAi = req.app.get("gpt");
  const { extraId, message, messages } = req.body;

  console.log(message);

  //protection
  let lmessages;
  if (!req.body.token) {
    try {
      lmessages = await MESSAGE.find({ userId: req.body.extraId });
    } catch (err) {
      console.log(err);
    }
    if (lmessages.length === 3) {
      const errors = new HttpError(
        "Login / Signup for free to send more messages.",
        500
      );
      return next(errors);
    }
  }
  //protection

  let dbData;

  try {
    dbData = await MESSAGE.find({ userId: extraId });
  } catch (err) {
    console.log(err);
  }

  let assistantData = dbData.map((item) => ({
    role: "assistant",
    content: `${item.gpt}`,
  }));

  openAi
    .createChatCompletion({
      model: "gpt-3.5-turbo",

      messages: [
        {
          role: "system",
          content:
            "You are AI physician chatbot and helpful assistance.You will provide any medical concerns information to the patient. And you will must remember all the previous conversation or information that a patient had given to you. if they provide you any remember them and symtoms response them based on their symtoms  ",
        },
        ...assistantData,

        ...messages,
        {
          role: "user",
          content: message,
        },
      ],
    })
    .then((ress) => {
      //console.log(res.data.choices[0].message.content);
      res.status(200).json({ result: ress.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getMessage = async (req, res) => {
  let message;

  try {
    message = await MESSAGE.find({ userId: req.body.userId });
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({ result: message });
};

const createMessage = async (req, res, next) => {
  let message;

  if (!req.body.token) {
    let messages;

    try {
      messages = await MESSAGE.find({ userId: req.body.userId });
    } catch (err) {
      console.log(err);
    }

    if (messages.length === 3) {
      const errors = new HttpError(
        "Login / Signup for free to send more messages.",
        500
      );
      return next(errors);
    }
  }

  try {
    message = await MESSAGE.create(req.body);
  } catch (err) {
    const errors = new HttpError("create message failed", 500);
    return next(errors);
  }
  res.status(200).json({ result: message });
};

module.exports = {
  createGpt,
  createMessage,
  getMessage,
};
