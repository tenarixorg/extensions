import {
  Chapter,
  Details,
  GetContent,
  Parser,
  Http,
  Util,
} from "@tenarix/core";

export const _details = (
  content: GetContent,
  parser: Parser,
  _http: Http,
  { decodeRoute, encodeRoute }: Util
) => {
  return async (route: string, execPath: string): Promise<Details> => {
    const url = "https://r1.leermanga.xyz" + decodeRoute(route);
    const { innerHTML } = await content(url, execPath);
    const $ = parser(innerHTML);
    const base = $(".container .row .col-md-8 .container .card");
    const img = base.find(".row .col-4 a img").attr("src")?.trim() || "";
    const title = base.find(".row .col-8 h2").text().trim();
    const status =
      base.find(".row .col-8 table tbody").text().trim().split(": ")[1] ||
      "unknown";
    const description = base
      .find(".row .col-8 p[itemprop=description]")
      .text()
      .trim();
    const genres: string[] = [];
    const chapters: Chapter[] = [];
    base.find(".row .col-12 table td a").each((_i, el) => {
      const genre = $(el).find("span").text().trim();
      genres.push(genre);
    });
    $("#chaptersTable a").each((_i, el) => {
      const ctitle = $(el).text().trim();
      const id = $(el).attr("href")?.trim() || "";
      chapters.push({
        title: ctitle,
        links: [{ src: "leer-manga", id: encodeRoute(id) }],
      });
    });
    return {
      title,
      description,
      status,
      img,
      type: "Manga",
      genres,
      chapters: chapters.reverse(),
    };
  };
};
