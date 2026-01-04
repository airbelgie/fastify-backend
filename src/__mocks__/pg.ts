// Mock pg module with configurable responses for testing
import { vi } from "vitest";

type MockQueryResult = {
  rows: Record<string, unknown>[];
  rowCount: number;
};

// Store mock responses that tests can configure
let mockQueryResponses: MockQueryResult[] = [];
let queryCallIndex = 0;

export const __setMockQueryResponses = (responses: MockQueryResult[]) => {
  mockQueryResponses = responses;
  queryCallIndex = 0;
};

export const __resetMocks = () => {
  mockQueryResponses = [];
  queryCallIndex = 0;
};

export const __getMockQueryFn = () => mockQueryFn;

const mockQueryFn = vi.fn().mockImplementation(() => {
  if (mockQueryResponses.length > 0) {
    const response = mockQueryResponses[queryCallIndex];
    queryCallIndex = (queryCallIndex + 1) % mockQueryResponses.length;
    return Promise.resolve(response);
  }
  return Promise.resolve({ rows: [{ now: new Date() }], rowCount: 1 });
});

export class Pool {
  query = mockQueryFn;

  connect() {
    return Promise.resolve();
  }

  end() {
    return Promise.resolve();
  }
}
