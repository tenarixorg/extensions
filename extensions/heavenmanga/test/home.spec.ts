import { parser, content, http, decodeRoute, encodeRoute } from "@tenarix/core";
import { _home } from "../src/home";

const home = _home(content, parser, http, { decodeRoute, encodeRoute });

jest.setTimeout(40000);

describe("Home", () => {
  test("should get Home page", async () => {
    const res = await home(process.env.CHROME || "");
    expect(res.popular).toBeInstanceOf(Array);
    expect(res.popular.length).toBeGreaterThan(1);
    expect(res.popular[0].title).toBeDefined();
    expect(res.popular[0].img).toBeDefined();
    expect(res.popular[0].type).toBeDefined();
    expect(res.popular[0].route).toBeDefined();
    expect(res.popular[0].title.length).toBeGreaterThan(0);
    expect(res.popular[0].img.length).toBeGreaterThan(0);
    expect(res.popular[0].route.length).toBeGreaterThan(0);
  });
});
