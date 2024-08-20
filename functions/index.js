const axios = require("axios");

// SlackのWebhook URL
const slackWebhookUrl =
  "https://hooks.slack.com/services/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";
const MyToken = "7d07b6290bba556e6c9613e41fa820113a8ab477";

// sendRandomArticleToSlack関数を定義
exports.sendRandomArticleToSlack = async () => {
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
      text: "これで勉強するっちゃ！！",
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
  } catch (error) {
    console.error("Error posting to Slack:", error);
  }
};


// デバッグ用に関数を直接呼び出す
exports.sendRandomArticleToSlack();

