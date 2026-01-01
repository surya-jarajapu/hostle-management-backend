export async function dbRetry<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (err) {
    console.error("DB retry after error:", err);
    await new Promise(r => setTimeout(r, 2000));
    return fn();
  }
}
