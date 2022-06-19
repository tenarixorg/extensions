import {
  Filters,
  GetContent,
  Http,
  Library,
  PageBase,
  Parser,
  Util,
} from "@tenarix/core";

const libraryParams = (_page: string, filters?: Filters) => {
  return `type=all&manga-name=${
    filters?.title || ""
  }&author-name=&artist-name=&status=both`;
};

export const _library = (
  _content: GetContent,
  parser: Parser,
  http: Http,
  { encodeRoute }: Util
) => {
  return async (
    page: string,
    _execPath: string,
    filters?: Filters
  ): Promise<Library> => {
    const res = await http.post(
      "https://www.readmng.com/advanced-search?",
      libraryParams(page, filters),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Referer: "https://www.readmng.com/advanced-search",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const $ = parser(res.data);
    const items: PageBase[] = [];
    $(".mangaSliderCard a").each((_i, el) => {
      const base = $(el);
      const title = base.find(".postDetail h2").text().trim();
      const route = base.attr("href")?.trim() || "";
      const img =
        base
          .find(".sliderImg img")
          .attr("src")
          ?.trim()
          .split("thumb/")
          .join("") || "";
      items.push({
        img,
        route: encodeRoute(route),
        title,
        type: "Manga",
      });
    });
    return {
      items,
    };
  };
};
