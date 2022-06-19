import { GetContent, Http, Parser, Read, Util } from "@tenarix/core";

export const _read = (
  content: GetContent,
  parser: Parser,
  _http: Http,
  { decodeRoute }: Util
) => {
  return async (id: string, execPath: string): Promise<Read> => {
    const url = `https://www.readmng.com${decodeRoute(id)}`;
    const { innerHTML } = await content(url, execPath, {
      scripts: true,
      imgs: false,
      action: async (page) => {
        await page.waitForSelector("#content #readerarea img");
      },
    });
    const $ = parser(innerHTML);
    const title = capitalize(id.split("=")[1].replace(/-/g, " ") || "");
    const info = "Chapter " + id.split("=")[2].replace(/\(/g, ".");
    const imgs = $("#content #readerarea img");
    const pages = imgs.length;
    const urls: Read["imgs"] = [];
    imgs.each((i, el) => {
      const url_ = $(el).attr("data-src")?.trim() || "";
      urls.push({ url: url_, page: i + 1 });
    });
    const id_ = urls[0].url
      .split("/chapter_files/")[1]
      .replace(/\//g, "")
      .split(".")[0];
    return {
      id: id_,
      title,
      info,
      pages,
      imgs: urls,
    };
  };
};
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
