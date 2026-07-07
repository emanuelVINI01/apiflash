import { AiConcurrencyError } from "./errors";

/**
 * Interface for distributed lock service.
 * Using a simple memory map for now, but ready to be swapped with Redis
 * or Postgres advisory locks in a real distributed environment.
 */
export class LockService {
  private activeLocks = new Set<string>();

  async acquire(key: string): Promise<void> {
    if (this.activeLocks.has(key)) {
      throw new AiConcurrencyError();
    }
    this.activeLocks.add(key);
  }

  async release(key: string): Promise<void> {
    this.activeLocks.delete(key);
  }
}
