import * as Koa from "koa"
import * as fs from "fs"
import * as serve from "koa-static"
import * as mount from "koa-mount"

const app = new Koa()

app.use(mount("/assets", serve(__dirname + '/src/Assets')));

app.use(mount('/client.js',async ctx => {
  const javascript = fs.readFileSync("dist/output/index.js", "utf-8")  
  ctx.type = 'application/javascript'
  ctx.body = javascript
}));

const scriptHost = process.env.SCRIPT_HOST ? process.env.SCRIPT_HOST : "http://localhost:3000"

app.use(mount('/format.js', async ctx => {
  const html = fs.readFileSync("src/story-format.html", "utf-8").replace(/{{SCRIPT_HOST}}/g, scriptHost)
  
  const outputJSON = {
    name: "Hedvig Twine",
    version: "1.0.0",
    author: "Hedvig",
    description: "",
    proofing: false,
    source: html
  };
  
  const outputString = "window.storyFormat(" + JSON.stringify(outputJSON, null, 2) + ");";

  ctx.type = 'html'
  ctx.body = outputString
}))

const port = process.env.PORT ? process.env.PORT : 3000
app.listen(port)

console.log(`server started at port ${port}`)