import { query } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API Handler function for getting all properties from the
 * MySQL database
 *
 * @param req request data
 * @param res response data
 * @returns JSON object containing all properties
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const properties = await query({
      query: "SELECT * FROM long_term_care_providers",
      values: [],
    });
    res.status(200).json({ properties });
  }
}
