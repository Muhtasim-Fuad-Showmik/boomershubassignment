"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  // References
  const nameRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();

  // States
  const [properties, setProperties] = useState([]);

  // Property functions
  async function addProperty() {}

  /**
   * Get all properties listed in our MySQL database
   */
  async function getProperties() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/properties`,
      postData
    );
  }
  async function updateProperty() {}
  async function deleteProperty() {}

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
            <tr className="border-r-2 shadow-md bg-white">
              <td className="text-left px-4 py-2">Brooksdale Creekside</td>
              <td className="text-left px-4 py-2">2000 W Spring Creek PKWY</td>
              <td className="text-left px-4 py-2">Plano</td>
              <td className="text-left px-4 py-2">Texas</td>
              <td className="text-left px-4 py-2">75203</td>
              <td className="text-left px-4 py-2">Collin</td>
              <td className="text-left px-4 py-2">Assisted Living Type B</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
