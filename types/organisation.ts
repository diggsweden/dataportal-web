// Organisation Types
export interface DataInfo {
  total: number;
  title: string;
}

export interface DatasetInfo {
  total: number;
  totTitle: string;
  dataInfo: DataInfo[];
  link: string;
}

export interface SpecificationInfo {
  total: number;
  link: string;
}

export interface TermInfo {
  title: string;
  url: string;
}

export interface TermsInfo {
  total: number;
  termsInfo: TermInfo[];
}
// Vem vet vad detta kommer att bli?
export interface ShowCaseInfo {
  date: string;
  title: string;
  text: string;
}

export interface OrganisationData {
  datasets: DatasetInfo;
  specifications: SpecificationInfo;
  terms: TermsInfo;
  orgClassification?: string;
  orgNumber?: string;
  orgType: string;
  showCases: ShowCaseInfo;
}
