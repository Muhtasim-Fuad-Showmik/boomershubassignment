"use client";

import { useEffect, useRef, useState } from "react";

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

export default function Home() {
  // References
  const nameRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();

  // States
  const [properties, setProperties] = useState<Array<Property>>([]);

  // Property functions

  /**
   * FUnction for inserting data into the MySQL database
   *
   * @param property new property object to be inserted into the database
   */
  async function addProperty(property: Property) {
    // Header configuration to send along with the fetch call
    const fetchConfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(property),
    };

    // Retrieve all properties from the database
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/properties`,
      fetchConfig
    );
    const response = await res.json();

    if (response.response.message !== "success") return;
  }

  /**
   * Get all properties listed in our MySQL database
   */
  async function getProperties() {
    // Header configuration to send along with the fetch call
    const fetchConfig = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Retrieve all properties from the database
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/properties`,
      fetchConfig
    );
    const response = await res.json();

    // Update properties state to store all retrieved properties
    setProperties(response.properties);
  }

  async function clearProperties() {}

  useEffect(() => {
    getProperties();
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-3xl mb-12">Long-Term Care Providers</h1>

      <div className="flex w-80 flex-col items-center justify-start">
        <div className="flex justify-start gap-4 mb-4">
          <input className="p-2 rounded-sm" type="text" placeholder="Name" />
          <input className="p-2 rounded-sm" type="text" placeholder="City" />
          <input className="p-2 rounded-sm" type="text" placeholder="State" />
          <button className="bg-slate-400 hover:bg-slate-300 px-4 py-2 rounded-md">
            Search
          </button>
        </div>
        <table className="w-[1100px] text-center">
          <thead>
            <tr className="border-r-2 bg-slate-500 text-white">
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Address</th>
              <th className="text-left px-4 py-2">City</th>
              <th className="text-left px-4 py-2">State</th>
              <th className="text-left px-4 py-2">Zip Code</th>
              <th className="text-left px-4 py-2">County</th>
              <th className="text-left px-4 py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr className="border-r-2 shadow-md bg-white" key={index}>
                <td className="text-left px-4 py-2">{property.Name}</td>
                <td className="text-left px-4 py-2">{property.Address}</td>
                <td className="text-left px-4 py-2">{property.City}</td>
                <td className="text-left px-4 py-2">{property.State}</td>
                <td className="text-left px-4 py-2">{property.Zip_Code}</td>
                <td className="text-left px-4 py-2">{property.County}</td>
                <td className="text-left px-4 py-2">{property.Type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
