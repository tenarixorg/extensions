import { Home, GetContent, Parser, PageBase, Http, Util } from "@tenarix/core";

export const _home = (
  content: GetContent,
  parser: Parser,
  _http: Http,
  { encodeRoute }: Util
) => {
  return async (execPath: string): Promise<Home> => {
    const { innerHTML } = await content(
      "https://lectormanga.com/library?title=&order_field=title&order_item=likes_count&order_dir=desc&type=&demography=&webcomic=&yonkoma=&amateur=&erotic=",
      execPath
    );
    const $ = parser(innerHTML);
    const popular: PageBase[] = [];
    $("#app .container .row div.col-12.col-lg-8 .card").each((_i, el) => {
      const title = $(el).find(".card-header a").text().trim();
      const route =
        $(el)
          .find(".card-header a")
          .attr("href")
          ?.trim()
          .split("/library/")[1] || "";
      const img = $(el).find(".card-body img").attr("src")?.trim() || "";
      const type = $(el).find(".card-footer span.float-right").text().trim();
      popular.push({
        title,
        route: encodeRoute(route),
        img,
        type,
      });
    });
    return {
      popular,
    };
  };
};
