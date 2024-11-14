class PublisherCacheManager {
  private static instance: PublisherCacheManager;
  private cache: Map<string, string>;

  private constructor() {
    this.cache = new Map<string, string>();
  }

  public static getInstance(): PublisherCacheManager {
    if (!PublisherCacheManager.instance) {
      PublisherCacheManager.instance = new PublisherCacheManager();
    }
    return PublisherCacheManager.instance;
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

export const publisherCache = PublisherCacheManager.getInstance();
