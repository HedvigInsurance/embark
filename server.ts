import * as Koa from "koa";
import * as fs from "fs";
import * as serve from "koa-static";
import * as mount from "koa-mount";
import * as cors from "@koa/cors";
import { JSDOM } from "jsdom";
import { parseStoryData } from "./src/parseStoryData";
import { storyKeywords } from "./src/storyKeywords";
import * as graphqlHTTP from "koa-graphql";

import { schema } from "./schema";

declare global {
  namespace NodeJS {
    interface Global {
      document: JSDOM;
    }
  }
}

global.document = new JSDOM("<html></html").window.document;

const app = new Koa();
app.use(cors());
app.use(mount("/assets", serve(__dirname + "/src/Assets")));

app.use(
  mount(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true
    })
  )
);

app.use(
  mount("/client.js", async ctx => {
    const javascript = fs.readFileSync("dist/output/index.js", "utf-8");
    ctx.type = "application/javascript";
    ctx.body = javascript;
  })
);

app.use(
  mount("/angel-data", async ctx => {
    const filename = ctx.request.query.name;

    if (!filename) {
      throw new Error("No filename provided");
    }

    if (filename.includes("../")) {
      throw new Error("Can't traverse downwards");
    }

    const json = JSON.parse(
      fs.readFileSync(`angel-data/${filename}.json`, "utf-8")
    );
    const storyData = parseStoryData(json);

    ctx.type = "application/json";
    ctx.body = JSON.stringify(storyData);
  })
);

const scriptHost = process.env.SCRIPT_HOST
  ? process.env.SCRIPT_HOST
  : "http://localhost:3000";

app.use(
  mount("/format.js", async ctx => {
    const proofing = ctx.request.query.proofing;
    const isProofing = proofing ? true : false;

    const html = fs
      .readFileSync("src/story-format.html", "utf-8")
      .replace(/{{SCRIPT_HOST}}/g, scriptHost)
      .replace(/{{IS_PROOFING}}/g, String(isProofing));

    const outputJSON = {
      name: "Hedvig Twine",
      version: "1.0.0",
      author: "Hedvig",
      description: "",
      proofing: isProofing,
      source: html,
      storyKeywords
    };

    const outputString =
      "window.storyFormat(" + JSON.stringify(outputJSON, null, 2) + ");";

    ctx.type = "html";
    ctx.body = outputString;
  })
);

app.use(
  mount("/health", async ctx => {
    ctx.body = { status: "ok" };
  })
);

const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port);

console.log(`server started at port ${port}`);
