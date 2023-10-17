import { query } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

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
  let properties = [];

  // Get all properties for GET requests
  if (req.method == "GET") {
    const properties = await query({
      query: "SELECT * FROM long_term_care_providers",
      values: [],
    });
    res.status(200).json({ properties });
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
      message = "success";

      // Prepare the new property data for successful creation
      let property = {
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

      // Send data back with success message
      res.status(200).json({ message, property });
    } else {
      message = "error";
      res.status(400).json({ message, property: {} });
    }
  }

  // Delete all properties for DELETE requests
  if (req.method == "DELETE") {
    const deletedProducts = await query({
      query: "DELETE * FROM long_term_care_providers",
      values: [],
    });

    // Setup success/error messages
    if ("affectedRows" in deletedProducts && deletedProducts.affectedRows) {
      message = "success";
    } else {
      message = "error";
    }
    res.status(200).json({ message });
  }
}
