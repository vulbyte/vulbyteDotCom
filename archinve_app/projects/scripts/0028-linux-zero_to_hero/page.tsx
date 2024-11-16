import Navbar from "@/components/navbar";
//import { remark } from "remark";
//import html from "remark-html";

//export async function getPostData(id: any) {
//  const fullPath = path.join("./", "script.md");
// const fileContents = fs.readFileSyncs(fullPath, "utf8");
// //parse with gray-matter
// const matterResult = matter(fileContents);
// // remark to convert md to html
// const processedContent = await remark()
//   .use(html)
//   .process(matterResult.content);
// const contentHtml = processedContent.toString;
// return {
//   id,
//   contentHtml,
//   ...matterResult.data,
// };
//}

// import Markdown from "markdown-to-jsx";
//
// export default function page() {
//   var fs = require("fs");
//
//   require.extensions[".md"] = function (module, filename) {
//     module.exports = fs.readFileSync(filename, "utf8");
//   };
//
//   let words = require("./script.md");
//
//   return <Markdown>words</Markdown>;
// }

import { promises as fs } from "fs";

let showdown = require("showdown");

export default async function page() {
  let words = await fs.readFile(
    process.cwd() + "/app/projects/scripts/0028-linux-zero_to_hero/script.md",
    "utf8",
  );

  let showdown = require("showdown"),
    converter = new showdown.Converter(),
    text = words,
    html = converter.makeHtml(text);
  //let converter = new showdown.Converter(),
  //  text = words,
  //  html = converter.makeHtml(text);
  return (
    <div>
      <Navbar />
      <div
        style={{ padding: "10%", textWrap: "wrap", lineBreak: "strict" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
