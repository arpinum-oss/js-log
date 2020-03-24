import { basename } from "./basename";

describe("basename function", () => {
  it("should return empty string for empty inputs", () => {
    expect(basename("")).toEqual("");
    expect(basename(null)).toEqual("");
    expect(basename(undefined)).toEqual("");
  });

  it("should return filename from single file", () => {
    expect(basename("a")).toEqual("a");
  });

  it("should return filename from simple path", () => {
    expect(basename("a/b")).toEqual("b");
  });

  it("should return filename from simple Windows path", () => {
    expect(basename("a\\b")).toEqual("b");
  });

  it("should return filename from nested path", () => {
    expect(basename("a/b/c/d")).toEqual("d");
  });

  it("should return filename without extension", () => {
    expect(basename("a.txt")).toEqual("a");
  });

  it("should return filename without last extension if various dots", () => {
    expect(basename("a.spec.js")).toEqual("a.spec");
  });

  it("may return filename starting with dot", () => {
    expect(basename(".gitignore")).toEqual(".gitignore");
  });
});
