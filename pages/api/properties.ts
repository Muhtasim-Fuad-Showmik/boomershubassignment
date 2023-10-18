import { query } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { propertyImages } from "@/constants";

interface Property {
  Id: number;
  Name: string;
  Address: string;
  City: string;
  State: string;
  Zip_Code: number;
  County: string;
  Phone: string;
  Type: string;
  Capacity: number;
}

/**
 * API Handler function for all properties operations
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
  let message = "";

  // Get all properties for GET requests
  if (req.method == "GET") {
    if ("id" in req.query) {
      const { id } = req.query;

      // Retrieve data from database and respond with its JSON object
      const property = await query({
        query: `SELECT * FROM long_term_care_providers WHERE Id = ${id}`,
        values: [],
      });
      res.status(200).json({ property });
    } else {
      // Prepared default whenClause and conditions variables
      let whereClause = "";
      const conditions: Array<string> = [];

      // Prepare the conditions that may need to be added
      const { name, city, state } = req.query;
      if (name) conditions.push(`Name = '${name}'`);
      if (city) conditions.push(`City = '${city}'`);
      if (state) conditions.push(`State = '${state}'`);

      // Concatenate conditions by 'AND' to the where clause
      if (conditions.length > 0) {
        whereClause = "WHERE " + conditions.join(" AND ");
      }

      // Retrieve data from database and respond with its JSON object
      const properties = await query({
        query: `SELECT * FROM long_term_care_providers ${whereClause}`,
        values: [],
      });
      res.status(200).json({ properties });
    }
  }

  // Create a new property for POST requests
  if (req.method == "POST") {
    // Collect property data from the request object
    const propertyData = req.body as Property;

    // Execute insert query to insert data into the MySQL database
    const addedProperty = await query({
      query:
        "INSERT INTO `long_term_care_providers` (" +
        "`Name`, `Address`, `City`, `State`, `Zip_Code`, `County`, `Phone`, `Type`, `Capacity`" +
        ") " +
        "VALUES (?,?,?,?,?,?,?,?,?);",
      values: [
        propertyData.Name,
        propertyData.Address,
        propertyData.City,
        propertyData.State,
        propertyData.Zip_Code,
        propertyData.County,
        propertyData.Phone,
        propertyData.Type,
        propertyData.Capacity,
      ],
    });

    // Setup a message based on execution success or failure
    if ("insertId" in addedProperty && addedProperty.insertId) {
      // Prepare the new property data for successful creation
      const property = {
        Id: addedProperty.insertId,
        Name: propertyData.Name,
        Address: propertyData.Address,
        City: propertyData.City,
        State: propertyData.State,
        Zip_Code: propertyData.Zip_Code,
        County: propertyData.County,
        Phone: propertyData.Phone,
        Type: propertyData.Type,
        Capacity: propertyData.Capacity,
      };

      // Add relevant images to the database
      let addedImages = {};
      if (propertyData.Name in propertyImages) {
        propertyImages[property.Name].forEach(async (url) => {
          // Execute insert query to insert image URLs into the MySQL database
          addedImages = await query({
            query:
              "INSERT INTO `images` (" +
              "`Long_Term_Care_Provider_Id`, `Image_URL`" +
              ") " +
              "VALUES (?,?);",
            values: [property.Id, url],
          });
        });
      }

      if ("insertId" in addedImages && addedImages.insertId) {
        message = "success";

        // Send data back with success message
        res.status(200).json({ message, property, addedImages });
      }
    }
    res.status(400).json({ message, property: {}, addedImages: {} });
  }

  // Delete all properties for DELETE requests
  if (req.method == "DELETE") {
    const deletedImages = await query({
      query: "DELETE FROM images",
      values: [],
    });

    const deletedProducts = await query({
      query: "DELETE FROM long_term_care_providers",
      values: [],
    });

    // Setup success/error messages
    if (
      "affectedRows" in deletedProducts &&
      deletedProducts.affectedRows &&
      "affectedRows" in deletedImages &&
      deletedImages.affectedRows
    ) {
      message = "success";
    } else {
      message = "error";
    }
    res.status(200).json({ message });
  }
}
