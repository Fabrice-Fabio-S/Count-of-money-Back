const RssParser = require("rss-parser");
const Utils = require("../config/Utils");

let parser = new RssParser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
  },
});

module.exports = {
  getRssFeed: async (req, res) => {
    await parser.parseURL("https://cointelegraph.com/rss").then((feed) => {
      console.log("RSS feed : " + feed.title + " has been send.");
      res.status(200).json(feed);
    });
  },
};
