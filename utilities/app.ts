import type {
  FormResponse,
  GoodExampleListResponse,
  GoodExampleResponse,
  ModuleResponse,
  MultiContainerResponse,
  NewsItemListResponse,
  NewsItemResponse,
  RootAggregateResponse,
  StartPageResponse,
  ToolListResponse,
} from "@/utilities/query-helpers";

export type DataportalPageProps =
  | MultiContainerResponse
  | StartPageResponse
  | NewsItemListResponse
  | NewsItemResponse
  | GoodExampleListResponse
  | GoodExampleResponse
  | RootAggregateResponse
  | FormResponse
  | ModuleResponse
  | ToolListResponse;
