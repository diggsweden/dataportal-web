import { NextApiRequest, NextApiResponse } from "next";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { config, resourceUri, locale, isSandbox } = req.body;

  try {
    const result = await handleEntryStoreRedirect(
      config,
      locale,
      isSandbox,
      resourceUri,
    );

    if (result.notFound) {
      return res.status(404).json(result);
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
