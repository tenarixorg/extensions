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
  return `https://zahard.xyz/search?query=${filters?.title || ""}`;
};

export const _library = (
  _content: GetContent,
  _parser: Parser,
  http: Http,
  { encodeRoute }: Util
) => {
  return async (
    page: string,
    _execPath: string,
    filters?: Filters
  ): Promise<Library> => {
    const items: PageBase[] = [];
    const res_ = await http.get<{
      suggestions: { value: string; data: string }[];
    }>(libraryParams(page, filters));
    const res = res_.data.suggestions;
    for (const sugg of res) {
      const title = sugg.value;
      const img = `https://zahard.xyz/uploads/manga/${sugg.data}/cover/cover_250x350.jpg`;
      const route = `manga/${sugg.data}`;
      items.push({
        img,
        title,
        type: "Manga",
        route: encodeRoute(route),
      });
    }
    return {
      items,
    };
  };
};
