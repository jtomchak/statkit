// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { assertRejects } from "std/assert/assert_rejects.ts";
import { getGitHubUser } from "./github.ts";
import { returnsNext, stub } from "std/testing/mock.ts";
import { errors } from "std/http/http_errors.ts";
import { assertEquals } from "std/assert/assert_equals.ts";
import { Status } from "kv_oauth/deps.ts";

Deno.test("[plugins] getGitHubUser()", async (test) => {
  await test.step("rejects on error message", async () => {
    const message = crypto.randomUUID();
    const fetchStub = stub(
      window,
      "fetch",
      returnsNext([
        Promise.resolve(
          Response.json({ message }, { status: Status.BadRequest }),
        ),
      ]),
    );
    await assertRejects(
      async () => await getGitHubUser(crypto.randomUUID()),
      errors.BadRequest,
      message,
    );
    fetchStub.restore();
  });

  await test.step("resolves to a GitHub user object", async () => {
    const body = { login: crypto.randomUUID(), email: crypto.randomUUID() };
    const fetchStub = stub(
      window,
      "fetch",
      returnsNext([Promise.resolve(Response.json(body))]),
    );
    assertEquals(await getGitHubUser(crypto.randomUUID()), body);
    fetchStub.restore();
  });
});
