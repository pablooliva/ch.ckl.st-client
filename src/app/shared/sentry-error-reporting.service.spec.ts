import { TestBed } from "@angular/core/testing";

import { SentryErrorReportingService } from "./sentry-error-reporting.service";

describe("SentryErrorReportingService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SentryErrorReportingService = TestBed.get(SentryErrorReportingService);
    expect(service).toBeTruthy();
  });
});
