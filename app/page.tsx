"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTrowel } from "@fortawesome/free-solid-svg-icons";

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
  const nameRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);

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

    if (response.message !== "success") return;
  }

  /**
   * Get all properties listed in our MySQL database
   */
  async function getProperties() {
    let queryParamsString = "";
    const queryParams: Array<string> = [];

    // Collect all of the search parameters
    if (nameRef.current && nameRef.current.value)
      queryParams.push(`name=${nameRef.current.value}`);
    if (cityRef.current && cityRef.current.value)
      queryParams.push(`city=${cityRef.current.value}`);
    if (stateRef.current && stateRef.current.value)
      queryParams.push(`state=${stateRef.current.value}`);

    // Generate query params string url extension
    if (queryParams.length > 0) {
      queryParamsString = "?" + queryParams.join("&");
    }

    // Header configuration to send along with the fetch call
    const fetchConfig = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Retrieve all properties from the database
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/properties${queryParamsString}`,
      fetchConfig
    );
    const response = await res.json();
    // Update properties state to store all retrieved properties
    setProperties(response.properties);
  }

  /**
   * Delete all properties from the database
   */
  async function deleteProperties() {
    // Header configuration to send along with the fetch call
    const fetchConfig = {
      method: "DELETE",
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
  }

  // Button functionalities
  async function scrapeProperties() {
    // Retrieve all properties from the database
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/scrapeProperties`
    );
    const response = await res.json();

    // Clear database of all existing properties
    deleteProperties()
      .then(async () => {
        // Add each property scraped from the external sources
        for (const [key, property] of Object.entries(
          response.properties as Property[]
        )) {
          await addProperty(property);
        }
      })
      .then(() => {
        // Retrieve all properties again from the database
        getProperties();
      });
  }

  useEffect(() => {
    getProperties();
  }, []);

  return (
    <main className="flex flex-col h-full w-screen items-center justify-start px-12 pb-14">
      <div className="flex w-full justify-center gap-4 my-12">
        <input
          className="px-6 py-2 rounded-md shadow-md"
          type="text"
          placeholder="Name"
          ref={nameRef}
          onKeyUp={(e) => {
            if (e.key == "Enter") getProperties();
          }}
        />
        <input
          className="px-6 py-2 rounded-md shadow-md"
          type="text"
          placeholder="City"
          ref={cityRef}
          onKeyUp={(e) => {
            if (e.key == "Enter") getProperties();
          }}
        />
        <input
          className="px-6 py-2 rounded-md shadow-md"
          type="text"
          placeholder="State"
          ref={stateRef}
          onKeyUp={(e) => {
            if (e.key == "Enter") getProperties();
          }}
        />
        <button
          onClick={getProperties}
          className="bg-lava hover:bg-maroon text-white px-4 py-2 rounded-md font-bold shadow-md"
        >
          <FontAwesomeIcon fontSize={16} icon={faMagnifyingGlass} />
          <span className="ml-2">Search</span>
        </button>
        <button
          onClick={scrapeProperties}
          className="bg-lava hover:bg-maroon text-white px-4 py-2 rounded-md font-bold shadow-md"
        >
          <FontAwesomeIcon fontSize={16} icon={faTrowel} />
          <span className="ml-2">Scrape</span>
        </button>
      </div>

      <div className="bg-white w-[90%] px-6 py-4 rounded-lg shadow-md">
        <table className="w-full text-center">
          <thead>
            <tr className="text-red-800 border-b-2">
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
              <tr className="" key={index}>
                <td className="text-left underline text-blue-400 px-4 py-2">
                  <Link
                    key={index}
                    href={`/details/${property.Id}`}
                    className="w-full inline-block"
                  >
                    {property.Name}
                  </Link>
                </td>
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
