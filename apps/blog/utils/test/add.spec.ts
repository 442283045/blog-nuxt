import { expect, it } from "vitest";
import add from "./add";

it("add", () => {
  expect(add(1, 2)).equal(3);
});
