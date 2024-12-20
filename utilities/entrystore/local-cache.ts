class EntryCacheManager {
  private static instance: EntryCacheManager;
  private cache: Map<string, string>;

  private constructor() {
    this.cache = new Map<string, string>();
  }

  public static getInstance(): EntryCacheManager {
    if (!EntryCacheManager.instance) {
      EntryCacheManager.instance = new EntryCacheManager();
    }
    return EntryCacheManager.instance;
  }

  public get(): Map<string, string> {
    return this.cache;
  }

  public getValue(key: string): string | undefined {
    return this.cache.get(key);
  }

  public set(key: string, value: string): void {
    this.cache.set(key, value);
  }
}

export const entryCache = EntryCacheManager.getInstance();
