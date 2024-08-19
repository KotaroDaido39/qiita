const functions = require("firebase-functions");
const axios = require("axios");

// SlackのWebhook URL
const slackWebhookUrl = "----";
const MyToken = "----";

exports.postToSlack = functions.https.onRequest((req, res) => {
  axios.get("https://qiita.com/api/v2/items?query=title:初心者&created:>=2020-01-01&per_page=50", {
    headers: {
      "Authorization": `Bearer ${MyToken}`,
    },
  })
    .then((response) => {
      const articles = response.data;
      const randomIndex = Math.floor(Math.random() * articles.length);
      const randomArticle = articles[randomIndex];
      const message = {
        title: randomArticle.title,
        url: randomArticle.url,
      };

      // Slackに投稿するメッセージを作成
      const slackMessage = {
        text: "これで勉強するっちゃ！！",
        attachments: [{
          title: message.title,
          title_link: message.url,
        }],
      };

      // Slackにメッセージを投稿
      return axios.post(slackWebhookUrl, slackMessage);
    })
    .then(() => {
      console.log("Slackにメッセージを投稿しました。");
      res.status(200).send("Slackにメッセージを投稿しました。");
    })
    .catch((error) => {
      console.error("エラーが発生しました:", error);
      res.status(500).send("エラーが発生しました。");
    });
});

