import { query } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

interface Image {
  Id: number;
  Long_Term_Care_Provider_Id: number;
  Image_URL: string;
}

/**
 * API Handler function for all image operations
 * with the MySQL database
 *
 * @param req request data
 * @param res response data
 * @returns JSON object containing response data
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get all properties for GET requests
  if (req.method == "GET") {
    if ("id" in req.query) {
      const { id } = req.query;

      // Retrieve data from database and respond with its JSON object
      const images = (await query({
        query: `SELECT * FROM images WHERE Long_Term_Care_Provider_Id = ${id}`,
        values: [],
      })) as Image[];
      res.status(200).json({ images });
    }
    res.status(400).json({ message: "Id not provided!", images: [] });
  }
}
