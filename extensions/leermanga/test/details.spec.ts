import { parser, content, http, encodeRoute, decodeRoute } from "@tenarix/core";
import { details_route } from "./helper";
import { _details } from "../src/details";

const details = _details(content, parser, http, { decodeRoute, encodeRoute });

jest.setTimeout(40000);

describe("Details", () => {
  test("should get details", async () => {
    const res = await details(details_route, process.env.CHROME || "");
    expect(res.chapters).toBeInstanceOf(Array);
    expect(res.description).toBeDefined();
    expect(res.genres).toBeDefined();
    expect(res.img).toBeDefined();
    expect(res.status).toBeDefined();
    expect(res.title).toBeDefined();
    expect(res.type).toBeDefined();
    expect(res.description.length).toBeGreaterThan(0);
    expect(res.img.length).toBeGreaterThan(0);
    expect(res.status.length).toBeGreaterThan(0);
    expect(res.title.length).toBeGreaterThan(0);
  });
});
