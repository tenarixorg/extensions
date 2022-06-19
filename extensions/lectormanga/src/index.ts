import { AppContent, GetContent, Http, Parser, Util } from "@tenarix/core";
import { _details } from "./details";
import { _library } from "./library";
import { _home } from "./home";
import { _read } from "./read";

export default (
  getContent: GetContent,
  parser: Parser,
  http: Http,
  util: Util
): AppContent => {
  const details = _details(getContent, parser, http, util);
  const library = _library(getContent, parser, http, util);
  const home = _home(getContent, parser, http, util);
  const read = _read(getContent, parser, http, util);
  return {
    name: "lector_manga",
    lang: "es",
    details,
    home,
    library,
    read,
    opts: {
      headers: {
        Referer: "",
      },
      refererRule: /* istanbul ignore next */ (url) => {
        if (url.includes("img1"))
          return (
            url.split("img1.")[0] +
            url.split("img1.")[1].split(".com")[0] +
            ".com"
          );
        return url;
      },
    },
  };
};
