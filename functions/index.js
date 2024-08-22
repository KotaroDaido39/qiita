const functions = require("firebase-functions");
const axios = require("axios");

// SlackのWebhook URL
const slackWebhookUrl =
  "-----SlackのWebhook URL----";
const MyToken = "----qiitaのアクセストークン----";

// sendRandomArticleToSlack関数を定義
exports.sendRandomArticleToSlack=functions.https.onRequest(async (req, res) => {
  try {
    console.log("Fetching articles from Qiita...");
    const response = await axios.get(
        "https://qiita.com/api/v2/items?query=title:初心者&created:>=2020-01-01&per_page=50",
        {
          headers: {
            Authorization: `Bearer ${MyToken}`,
          },
        },
    );

    console.log("Articles fetched successfully.");
    const articles = response.data;
    const randomIndex = Math.floor(Math.random() * articles.length);
    const randomArticle = articles[randomIndex];
    const message = {
      title: randomArticle.title,
      url: randomArticle.url,
    };

    console.log("Selected random article:", message);

    // Slackに投稿するメッセージを作成
    const slackMessage = {
      text: "これで勉強してね",
      attachments: [
        {
          title: message.title,
          title_link: message.url,
        },
      ],
    };

    console.log("Posting message to Slack...");
    console.log("Slack Webhook URL:", slackWebhookUrl);
    console.log("Slack Message:", slackMessage);

    // Slackにメッセージを投稿
    await axios.post(slackWebhookUrl, slackMessage);

    console.log("Slackにメッセージを投稿しました。");
    res.status(200).send("Slackにメッセージを投稿しました。");
  } catch (error) {
    console.error("Error posting to Slack:", error);
    res.status(500).send("Error posting to Slack");
  }
});
