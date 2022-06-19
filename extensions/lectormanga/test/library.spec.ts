import { content, decodeRoute, encodeRoute, http, parser } from "@tenarix/core";
import { libraryFilters } from "./helper";
import { _library } from "../src/library";

const library = _library(content, parser, http, { encodeRoute, decodeRoute });

jest.setTimeout(40000);

describe("Library", () => {
  test("should get Library page", async () => {
    const res = await library("1", process.env.CHROME || "", libraryFilters);
    expect(res.items).toBeInstanceOf(Array);
    expect(res.items.length).toBeGreaterThan(1);
    expect(res.items[0].title).toBeDefined();
    expect(res.items[0].img).toBeDefined();
    expect(res.items[0].type).toBeDefined();
    expect(res.items[0].route).toBeDefined();
    expect(res.items[0].title.length).toBeGreaterThan(0);
    expect(res.items[0].img.length).toBeGreaterThan(0);
    expect(res.items[0].route.length).toBeGreaterThan(0);
  });
});
