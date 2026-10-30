import { describe, expect, it } from "vitest";
import { localeFromPath, localizedPath, stripLocale } from "./paths";

describe("locale paths", () => {
  it("omits the prefix for the default locale only", () => {
    expect(localizedPath("/", "en")).toBe("/");
    expect(localizedPath("/login", "en")).toBe("/login");
    expect(localizedPath("/", "fa")).toBe("/fa");
    expect(localizedPath("/login", "fa")).toBe("/fa/login");
  });

  it("strips and detects locales", () => {
    expect(stripLocale("/fa/admin/users")).toBe("/admin/users");
    expect(stripLocale("/fa")).toBe("/");
    expect(stripLocale("/admin")).toBe("/admin");
    expect(stripLocale("/fashion")).toBe("/fashion");
    expect(localeFromPath("/fa/x")).toBe("fa");
    expect(localeFromPath("/fashion")).toBe("en");
  });
});
