import { GetContent, Http, Parser, Read, Util } from "@tenarix/core";

export const _read = (
  content: GetContent,
  parser: Parser,
  _http: Http,
  { decodeRoute }: Util
) => {
  return async (id: string, execPath: string): Promise<Read> => {
    const url = `https://heavenmanga.com/${decodeRoute(id)}`;
    const { innerHTML: baseHTML } = await content(url, execPath);
    const $ = parser(baseHTML);
    const newUrl = $("#leer").attr("href");
    const { innerHTML } = await content(newUrl || "", execPath, {
      action: async (page) => {
        const cascade = await page.waitForSelector(".toggleModeButtons");
        await cascade?.click();
        await page.waitForTimeout(1000);
      },
      scripts: true,
    });
    return load(parser, innerHTML);
  };
};

function load(parser: Parser, innerHTML: string) {
  const $ = parser(innerHTML);
  const title = $(".row .col-xs-12 h2 a").text().trim();
  const info = $(".row .col-xs-12 h2 small").text().trim().replace(/\n/g, " ");
  const imgs = $("#lector img");
  const pages = imgs.length;
  const urls: Read["imgs"] = [];
  imgs.each((i, el) => {
    const url = $(el).attr("src")?.trim() || "";
    urls.push({ url, page: i + 1 });
  });
  const id = urls[0].url.split("id=")[1];
  return {
    id,
    title,
    info,
    pages,
    imgs: urls,
  };
}
