import {
  Chapter,
  ChapterInfo,
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
  { decodeRoute }: Util
) => {
  return async (route: string, execPath: string): Promise<Details> => {
    const url = "https://lectortmo.com/library/" + decodeRoute(route);
    const { innerHTML } = await content(url, execPath);
    const $ = parser(innerHTML);
    const chapters: Chapter[] = [];
    const genres: string[] = [];
    $("main ul.list-group li.list-group-item.upload-link").each((_, e) => {
      const title = $(e).find(".btn-collapse").text().trim();
      const links: ChapterInfo[] = [];
      $(e)
        .find("li.list-group-item")
        .each((_i, el) => {
          const src = $(el).find(".text-truncate span a").text().trim();
          const uri = $(el)
            .find("a.btn.btn-default.btn-sm")
            .attr("href")
            ?.trim();
          links.push({
            src,
            id: uri?.split("/view_uploads/")[1] || "",
          });
        });
      chapters.push({
        title,
        links,
      });
    });
    const title = $("h1.element-title").text().trim().replace(/\n/g, " ");
    const description = $("p.element-description").text().trim();
    const status = $("span.book-status").text().trim();
    const img = $("img.book-thumbnail").attr("src")?.trim() || "";
    const type = $("h1.book-type").text().trim();
    $("h6 a.badge").each((_, e) => {
      const genre = $(e).text().trim();
      genres.push(genre);
    });
    return {
      title,
      description,
      status,
      img,
      type,
      genres,
      chapters,
    };
  };
};
