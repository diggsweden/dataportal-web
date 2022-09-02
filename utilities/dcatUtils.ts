export type DCATData = {
  templates: [TextTemplate | GroupTemplate | ChoiceTemplate | ExtensionTemplate];
};

export interface TextTemplate {
  cardinality: { min: number; pref: number };
  description: { en: string; sv: string };
  id: string;
  label: { sv: string; en: string };
  nodetype: string;
  property: string;
  type: string;
}

export interface GroupTemplate {
  constraints: any;
  id: string;
  label: { sv: string; en: string };
  items: [TextTemplate | GroupTemplate | ChoiceTemplate | ExtensionTemplate];
  nodetype: string;
  styles: [string];
  property: string;
  type: string;
}

export interface ChoiceTemplate {
  choices: [Choice];
  id: string;
  label: { sv: string; en: string };
  nodetype: string;
  property: string;
  styles: [string];
  type: string;
}

export interface Choice {
  label: { en: string; sv: string };
  value: string;
}

export interface ExtensionTemplate {
  cardinality: { min: number; pref: number };
  description: { en: string; sv: string };
  id: string;
  extends: string;
  property: string;
  type: 'extension';
}

export const listChoices = async (property: string, dcatMeta: DCATData): Promise<string[]> => {
  return new Promise<string[]>(async (resolve) => {
    let result: string[] = [];

    if (property && dcatMeta) {
      let matchingNodes = dcatMeta.templates.filter(
        (d) => d.type == 'choice' && d.property == property
      );

      if (matchingNodes && matchingNodes.length > 0) {
        matchingNodes.forEach((m) => {
          (m as ChoiceTemplate).choices.forEach((c) => {
            result.push(c.value);
          });
        });
      }
    }

    resolve(result);
  });
};

export const fetchDCATMeta = async (dcatUrl: string): Promise<DCATData | undefined> => {
  return new Promise<DCATData | undefined>(async (resolve) => {
    let dcatFileUrl = dcatUrl || '/dcatse_bundle_2022-02-20.json';

    if (dcatFileUrl && dcatFileUrl.length > 0) {
      await fetch(dcatFileUrl, {
        mode: 'cors',
      })
        .then((response) => response.json())
        .then((d: DCATData) => {
          if (d && d.templates.length > 0) resolve(d);
        })
        .catch(() => {
          resolve(undefined);
        });
    } else resolve(undefined);
  });
};
