import { Home, GetContent, Parser, PageBase, Http, Util } from "@tenarix/core";

export const _home = (
  content: GetContent,
  parser: Parser,
  _http: Http,
  { encodeRoute }: Util
) => {
  return async (execPath: string): Promise<Home> => {
    const { innerHTML } = await content(
      "https://www.readmng.com/hot-manga",
      execPath
    );
    const $ = parser(innerHTML);
    const popular: PageBase[] = [];
    $(
      "#content .container .row .col-lg-9 .row .categoryContent .galeriContent .mangaSliderCard"
    ).each((_i, el) => {
      const title = $(el).find("a .postDetail h2").text().trim();
      const route = $(el).find("a").attr("href")?.trim() || "";
      const img =
        $(el)
          .find("a .sliderImg img")
          .attr("src")
          ?.trim()
          .split("thumb/")
          .join("") || "";
      popular.push({
        img,
        title,
        type: "Manga",
        route: encodeRoute(route),
      });
    });

    return {
      popular,
    };
  };
};
