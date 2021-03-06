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
    const url = "https://teenmanhua.com/" + decodeRoute(route);
    const { innerHTML } = await content(url, execPath);
    const $ = parser(innerHTML);
    const genres: string[] = [];
    const chapters: Chapter[] = [];
    const base = $("body .wrap .body-wrap .site-content");
    const base1 = base.find(".profile-manga .container .row .col-12");
    const base2 = base1.find(".summary_content_wrap .summary_content");
    const base3 = base.find(
      ".c-page-content .content-area .container .row .c-page .c-page__content"
    );
    const title = base1.find(".post-title h1").text().trim();
    const img =
      base1.find(".tab-summary .summary_image a img").attr("src")?.trim() || "";
    const status = base2
      .find(".post-status .post-content_item .summary-content")
      .text()
      .trim();
    const description = base3
      .find(".description-summary .summary__content .messageContent article p")
      .text()
      .trim();
    base2.find(".post-content .genres-content a").each((_i, el) => {
      const gender = $(el).text().trim();
      genres.push(gender);
    });
    base3
      .find(".page-content-listing .listing-chapters_wrap ul li")
      .each((_i, el) => {
        const base_ = $(el).find("a:first-child");
        const ctitle = base_.text().trim();
        const id = base_.attr("href")?.trim().split(".com/")[1] || "";
        chapters.push({
          title: ctitle,
          links: [
            {
              id: encodeRoute(id),
              src: "teen_manhua",
            },
          ],
        });
      });
    return {
      title,
      img,
      status,
      description,
      type: "Manhua",
      genres,
      chapters,
    };
  };
};
