const express = require("express")
const app = express()
const Cache = require('mem-cache')
const cache = new Cache()
const cheerio = require("cheerio")
const request = require("request")
app.get("/stackoverflow", (req, res, next) => {
    let q = req.query.q
    if(cache.get(q) != null) {
      res.send(cache.get(q))
      } else {
      request.get(q, (err, resp, body) => {
        let $ = cheerio.load(body)
        let html = $(".accepted-answer > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > div:nth-child(1)").html()
        if (html == "") {
          res.send("false")
        } else {
          console.log(html);
          html.replace("<pre>", `<pre class="prettyprint">`, -1)
          let question = $("#question-header > h1 > a").text()
          html = `<a href="` + q + `"><h3>` + question + "</h3></a>" + html
          cache.set(q, html)
          res.send(html)
        }
      })
    }

})

app.listen(process.env.PORT || 80)
