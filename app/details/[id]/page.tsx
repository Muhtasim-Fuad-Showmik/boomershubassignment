"use client";

import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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

interface Image {
  Id: number;
  Long_Term_Care_Provider_Id: number;
  Image_URL: string;
}

interface Params {
  params: { id: number };
}

export default function Page({ params }: Params) {
  // States
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  // API functions
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

    // Update property state to store the retrieved property
    setProperty(response.property[0]);
  }

  /**
   * Get all images for the specified property from our MySQL database
   */
  async function getImages() {
    // Header configuration to send along with the fetch call
    const fetchConfig = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Retrieve all properties from the database
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/images?id=${params.id}`,
      fetchConfig
    );
    const response = await res.json();
    // Update properties state to store all retrieved properties
    setImages(response.images);
  }

  useEffect(() => {
    getProperty();
    getImages();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-3xl text-center mb-12">Long-Term Care Providers</h1>

      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col items-center justify-start w-1/2">
          <div className="w-[400px] mb-2">
            <Carousel>
              {images.map((image) => (
                <div key={image.Id}>
                  <img src={image.Image_URL} />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="w-[400px] mb-12">
            <h2 className="text-xl text-left mb-2">Ownership Information</h2>
            <table>
              <tbody>
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
                  <td className="font-bold w-24">County: </td>
                  <td>{property?.County}</td>
                </tr>
                <tr>
                  <td className="font-bold w-24">Phone: </td>
                  <td>{property?.Phone}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-[400px] mb-12">
            <h2 className="text-xl text-left mb-2">Facility Description</h2>
            <table>
              <tbody>
                <tr>
                  <td className="font-bold w-24">Type:</td>
                  <td>{property?.Type}</td>
                </tr>
                <tr>
                  <td className="font-bold w-24">Capacity:</td>
                  <td>{property?.Capacity}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center justify-start w-1/2">
          MapBox
        </div>
      </div>
    </div>
  );
}
