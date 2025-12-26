// Mock pg module
export class Pool {
  query() {
    return Promise.resolve({ rows: [{ now: new Date() }] });
  }
  connect() {
    return Promise.resolve();
  }
  end() {
    return Promise.resolve();
  }
}
