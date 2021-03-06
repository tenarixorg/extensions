import { Home, GetContent, Parser, PageBase, Http, Util } from "@tenarix/core";

export const _home = (
  content: GetContent,
  parser: Parser,
  _http: Http,
  { encodeRoute }: Util
) => {
  return async (execPath: string): Promise<Home> => {
    const { innerHTML } = await content(
      "https://zahard.xyz/manga-list",
      execPath
    );
    const $ = parser(innerHTML);
    const popular: PageBase[] = [];
    $(
      "body .container-fluid .row:nth-child(3) .col-sm-8 .col-sm-12 .type-content .row .content .media"
    ).each((_i, el) => {
      const base = $(el).find(".media-body h5.media-heading a.chart-title");
      const img = $(el).find(".media-left a img").attr("src")?.trim() || "";
      const title = base.text().trim();
      const route = base.attr("href")?.trim().split(".xyz/")[1] || "";
      popular.push({
        img,
        title,
        route: encodeRoute(route),
        type: "Manga",
      });
    });
    return {
      popular,
    };
  };
};
