import test from "node:test";
import assert from "node:assert/strict";
import {
  getCompanyPromptByKey,
  getCompanyPromptByName,
  resolveCompanyInterviewPrompt,
} from "./companyInterviewPrompts.js";

test("getCompanyPromptByKey resolves known company", () => {
  const profile = getCompanyPromptByKey("google");
  assert.equal(profile.key, "google");
  assert.equal(profile.name, "Google");
});

test("getCompanyPromptByName resolves fuzzy company name", () => {
  const profile = getCompanyPromptByName("Microsoft Corporation");
  assert.equal(profile.key, "microsoft");
});

test("resolveCompanyInterviewPrompt supports custom profile", () => {
  const resolved = resolveCompanyInterviewPrompt({
    type: "custom",
    name: "Acme Labs",
    website: "https://acme.dev/jobs/123",
    title: "Acme Platform Round",
    description:
      "Focus on platform reliability, migration strategy, and clear stakeholder communication.",
  });

  assert.equal(resolved.companyKey, "custom");
  assert.equal(resolved.companyName, "Acme Labs");
  assert.equal(resolved.companyWebsite, "https://acme.dev/jobs/123");
  assert.match(resolved.promptText, /platform reliability/i);
});

test("resolveCompanyInterviewPrompt falls back to general", () => {
  const resolved = resolveCompanyInterviewPrompt({
    type: "preset",
    key: "unknown-brand",
  });

  assert.equal(resolved.companyKey, "general");
  assert.equal(resolved.companyName, "General");
});
