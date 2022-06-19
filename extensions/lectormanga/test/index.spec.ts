import extension from "../src";
import { parser, content, http, decodeRoute, encodeRoute } from "@tenarix/core";

const base = extension(content, parser, http, { encodeRoute, decodeRoute });

describe("Extension", () => {
  test("should be a valid extension", () => {
    expect(base.home).toBeInstanceOf(Function);
    expect(base.read).toBeInstanceOf(Function);
    expect(base.details).toBeInstanceOf(Function);
    expect(base.library).toBeInstanceOf(Function);
    expect(base.name).toBeDefined();
    expect(base.lang).toBeDefined();
  });
});
