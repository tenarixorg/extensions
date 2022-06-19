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
    name: "teen_manhua",
    lang: "en",
    details,
    home,
    library,
    read,
  };
};
