declare module "@entryscape/entrystore-js" {
  export class EntryStore {
    constructor(url: string);
    facetLimit(limit: number): this;
    getBaseURI(): string;
    getContextById(id: string): Context;
    newSolrQuery(): SolrQuery;
  }

  export class EntryStoreUtil {
    constructor(entrystore: EntryStore);
    loadEntriesByResourceURIs(
      uris: string[],
      context: Context | null,
      all: boolean,
      asyncCallType?: any,
    ): Promise<Entry[]>;
    loadOnlyPublicEntries(all: boolean): void;
  }

  export class SolrQuery {
    constructor(entrystore: EntryStore);

    // Core search methods
    rdfType(type: string | string[], modifier?: boolean | string): this;
    publicRead(val?: boolean): this;
    limit(num: number): this;
    offset(num: number): this;
    sort(sort: string): this;
    facetLimit(limit: number): this;

    // Search field methods
    title(val: string | string[], modifier?: boolean | string): this;
    description(val: string | string[], modifier?: boolean | string): this;
    all(val: string | string[], modifier?: boolean | string): this;

    // Property search methods
    literalProperty(
      predicate: string,
      object: string | string[],
      modifier?: boolean | string | null,
      indexType?: "ngram" | "text" | "string",
      related?: Boolean,
    ): this;

    uriProperty(
      predicate: string,
      object: string | string[],
      modifier?: boolean | string | null,
      related?: Boolean,
    ): this;

    // Query behavior modifiers
    disjunctive(): this;
    disjunctiveProperties(): this;

    // List creation and execution
    list(asyncCallType?: any): SearchList;
    getEntries(page?: number): Promise<Entry[]>;
    getEntry(): Promise<Entry>;
    size(): Promise<number>;

    // Facet methods
    uriFacet(predicate: string, related?: boolean): this;
    literalFacet(predicate: string, related?: boolean): this;

    // Internal methods
    getQuery(): string;
  }

  export class SearchList {
    constructor(entrystore: EntryStore, query: SolrQuery, asyncCallType?: any);
    getEntries(page?: number): Promise<Entry[]>;
    getSize(): number;
    getFacets(): Facet[];
    getQuery(): string;
    forEach(callback: (entry: Entry) => void): Promise<void>;
  }

  export class Entry {
    getMetadata(): Metadata;
    getAllMetadata(): Metadata;
    getContext(): Context;
    getId(): string;
    getResourceURI(): string;
  }

  export class Metadata {
    find(subject: any, predicate: string): MetadataValue[];
    findFirstValue(subject: any, predicate: string): string;
  }

  export interface MetadataValue {
    getValue(): string;
    getLanguage(): string;
  }

  export interface Context {
    getResourceURI(): string;
    getId(): string;
  }
}
