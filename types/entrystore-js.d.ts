/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "@entryscape/entrystore-js" {
  export class EntryStore {
    constructor(_url: string);
    facetLimit(_limit: number): this;
    getBaseURI(): string;
    getContextById(_id: string): Context;
    getEntryURI(_cid: string, _eid: string): string;
    newSolrQuery(): SolrQuery;
    getEntry(_uri: string): Promise<Entry>;
    getContextId(_uri: string): string;
    getContext(_uri: string): Context;
    getREST(): REST;
  }

  export class EntryStoreUtil {
    constructor(_entrystore: EntryStore);
    loadEntriesByResourceURIs(
      _uris: string[],
      _context: Context | null,
      _all: boolean,
      _asyncCallType?: any,
    ): Promise<Entry[]>;
    loadOnlyPublicEntries(_all: boolean): void;
    getEntryByResourceURI(_uri: string): Promise<Entry>;
  }

  export class SolrQuery {
    constructor(_entrystore: EntryStore);

    // Core search methods
    rdfType(_type: string | string[], _modifier?: boolean | string): this;
    publicRead(_val?: boolean): this;
    limit(_num: number): this;
    offset(_num: number): this;
    sort(_sort: string): this;
    facetLimit(_limit: number): this;
    context(_context: string): this;
    // Search field methods
    or(_fields: { [key: string]: string }): this;
    title(_val: string | string[], _modifier?: boolean | string): this;
    description(_val: string | string[], _modifier?: boolean | string): this;
    tagLiteral(_val: string | string[], _modifier?: boolean | string): this;
    all(_val: string | string[], _modifier?: boolean | string): this;
    // Property search methods
    literalProperty(
      _predicate: string,
      _object: string | string[],
      _modifier?: boolean | string | null,
      _indexType?: "ngram" | "text" | "string",
      _related?: boolean,
    ): this;

    uriProperty(
      _predicate: string,
      _object: string | string[],
      _modifier?: boolean | string | null,
      _related?: boolean,
    ): this;

    // Query behavior modifiers
    disjunctive(): this;
    disjunctiveProperties(): this;

    // List creation and execution
    list(_asyncCallType?: any): SearchList;
    getEntries(_page?: number): Promise<Entry[]>;
    getEntry(): Promise<Entry>;
    size(): Promise<number>;

    // Facet methods
    uriFacet(_predicate: string, _related?: boolean): this;
    literalFacet(_predicate: string, _related?: boolean): this;

    // Internal methods
    getQuery(): string;
  }

  export class SearchList {
    constructor(
      _entrystore: EntryStore,
      _query: SolrQuery,
      _asyncCallType?: any,
    );
    getEntries(_page?: number): Promise<Entry[]>;
    getSize(): number;
    getFacets(): Facet[];
    getQuery(): string;
    forEach(_callback: (_entry: Entry) => void): Promise<void>;
  }

  export class Entry {
    getMetadata(): Metadata;
    getAllMetadata(): Metadata;
    getContext(): Context;
    getId(): string;
    getResourceURI(): string;
    getEntryInfo(): EntryInfo;
  }

  export class Metadata {
    find(_subject: any, _predicate: string): MetadataValue[];
    findFirstValue(_subject: any, _predicate: string): string;
  }

  export interface MetadataValue {
    getValue(): string;
    getLanguage(): string;
  }

  export interface Context {
    getResourceURI(): string;
    getId(): string;
    getEntryURI(): string;
  }
}
