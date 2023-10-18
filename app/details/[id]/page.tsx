"use client";

import { useEffect, useState } from "react";

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

interface Params {
  params: { id: number };
}

export default function Page({ params }: Params) {
  // States
  const [property, setProperty] = useState<Property | null>(null);

  // Property functions
  /**
   * Get the specified proerty from the MySQL database
   */
  async function getProperty() {
    let queryParamsString = "";

    // Header configuration to send along with the fetch call
    const fetchConfig = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Retrieve all properties from the database
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/properties?id=${params.id}`,
      fetchConfig
    );
    const response = await res.json();
    console.log("🚀 ~ file: page.tsx:47 ~ getProperty ~ response:", response);

    // Update property state to store the retrieved property
    setProperty(response.property[0]);
  }

  useEffect(() => {
    getProperty();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-3xl text-center mb-12">Long-Term Care Providers</h1>

      <div className="w-[400px] mb-12">
        <h2 className="text-xl text-left mb-2">Ownership Information</h2>
        <table>
          <tr>
            <td className="font-bold w-24">Name: </td>
            <td>{property?.Name}</td>
          </tr>
          <tr>
            <td className="font-bold w-24">Address: </td>
            <td>{property?.Address}</td>
          </tr>
          <tr>
            <td className="font-bold w-24">City: </td>
            <td>
              {property?.City} - {property?.Zip_Code}
            </td>
          </tr>
          <tr>
            <td className="font-bold w-24">State: </td>
            <td>{property?.State}</td>
          </tr>
          <tr>
            <td className="font-bold w-24">County: </td>
            <td>{property?.County}</td>
          </tr>
          <tr>
            <td className="font-bold w-24">Phone: </td>
            <td>{property?.Phone}</td>
          </tr>
        </table>
      </div>

      <div className="w-[400px] mb-12">
        <h2 className="text-xl text-left mb-2">Facility Description</h2>
        <table>
          <tr>
            <td className="font-bold w-24">Type:</td>
            <td>{property?.Type}</td>
          </tr>
          <tr>
            <td className="font-bold w-24">Capacity:</td>
            <td>{property?.Capacity}</td>
          </tr>
        </table>
      </div>
    </div>
  );
}
