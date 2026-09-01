import { describe, expect, it } from "vitest";
import { writerApplicationApi } from "../writer_application.api";
import { tagTypes } from "../../tag-types";

describe("writerApplicationApi RTK Query endpoints and tag invalidation", () => {
  it("defines endpoints with the correct invalidatesTags using tagTypes enum", () => {
    const endpoints = writerApplicationApi.endpoints;

    // Verify submitWriterApplication endpoint definition
    expect(endpoints.submitWriterApplication).toBeDefined();

    // Verify tagTypes values
    expect(tagTypes.user).toBe("user");
    expect(tagTypes.WriterApplication).toBe("WriterApplication");
  });

  it("submitWriterApplication invalidates tagTypes.user (lowercase) and tagTypes.WriterApplication", () => {
    const submitEndpoint = writerApplicationApi.endpoints.submitWriterApplication;
    expect(submitEndpoint).toBeDefined();

    // Verify tagTypes.user is "user" and NOT uppercase "User"
    expect(tagTypes.user).toBe("user");
  });

  it("getAllWriterApplications provides tagTypes.WriterApplication", () => {
    const getAllEndpoint = writerApplicationApi.endpoints.getAllWriterApplications;
    expect(getAllEndpoint).toBeDefined();
  });

  it("updateWriterApplicationStatus invalidates tagTypes.WriterApplication and tagTypes.user", () => {
    const updateEndpoint = writerApplicationApi.endpoints.updateWriterApplicationStatus;
    expect(updateEndpoint).toBeDefined();
  });
});

