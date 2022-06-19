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
    const baseUrl = "https://inmanga.com";
    const url = baseUrl + decodeRoute(route);
    const { innerHTML } = await content(url, execPath, {
      scripts: true,
      imgs: true,
      action: async (page) => {
        await page.waitForSelector("i.icon-list ");
      },
    });
    const $ = parser(innerHTML);
    const chapters: Chapter[] = [];
    const genres: string[] = [];
    const img =
      baseUrl +
      "/thumbnails" +
      decodeRoute(route).substring(4, decodeRoute(route).length);
    const title = $(".panel-heading h1").text().trim();
    const description = $(".panel-body").text().trim();
    const status = $(".list-group a span").first().text().trim();
    $(".panel-heading span").each((_i, el) => {
      const genre = $(el).text().trim();
      genres.push(genre);
    });
    $("#ChaptersContainer a").each((_, el) => {
      if ($(el).attr("id") !== "noSearchResultElement") {
        const title = $(el)
          .find(".media-box .media-box-body span.strong")
          .text()
          .trim();

        const id = $(el).attr("href")?.trim() || "";
        const src = "Inmanga";
        chapters.push({
          title,
          links: [{ id: encodeRoute(id), src }],
        });
      }
    });
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
