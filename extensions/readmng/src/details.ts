import {
  Chapter,
  Details,
  GetContent,
  Http,
  Parser,
  Util,
} from "@tenarix/core";

export const _details = (
  content: GetContent,
  parser: Parser,
  _http: Http,
  { decodeRoute, encodeRoute }: Util
) => {
  return async (route: string, execPath: string): Promise<Details> => {
    const url = "https://www.readmng.com" + decodeRoute(route);
    const { innerHTML } = await content(url, execPath);
    const $ = parser(innerHTML);
    const base = $("#content .container .row .col-lg-9 .row");
    const title = base.find(".productDetail .titleArea h1").text().trim();
    const img =
      base
        .find(".productDetail .productLeft .thumbook .thumb a img")
        .attr("src")
        ?.split("thumb/")
        .join("") || "";
    const status = base
      .find(
        ".productDetail .productLeft .thumbook .rt .tsinfo .imptdt:nth-of-type(2) i"
      )
      .text()
      .trim();
    const description = base
      .find(
        ".productDetail .productRight .infox .wd-full:nth-of-type(2) p:nth-of-type(2)"
      )
      .text()
      .trim()
      .replace(/"/g, "");
    const genres: string[] = [];
    const chapters: Chapter[] = [];
    base
      .find(".productDetail .productRight .infox .mgen a[href^=/category]")
      .each((_i, el) => {
        const genre = $(el).text().trim();
        genres.push(genre);
      });
    $("#chapters .chapterWrap #chapters-tabContent .checkBoxCard a").each(
      (_i, el) => {
        const ctitle = $(el).text().trim();
        const id = $(el).attr("href")?.trim() || "";
        const src = "read-mng";
        chapters.push({ title: ctitle, links: [{ id: encodeRoute(id), src }] });
      }
    );
    return {
      title,
      description,
      status,
      img,
      type: "Manga",
      genres,
      chapters,
    };
  };
};
