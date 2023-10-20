"use client";

import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MapComponent from "@/components/mapComponent";

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
  const [loaded, setLoaded] = useState<boolean>(false);

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
    setLoaded(true);
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
    <div className="flex h-full w-screen flex-col items-center justify-start px-12 pb-14">
      <div className="flex items-start justify-between w-full h-full gap-4">
        <div className="flex flex-col items-center justify-start w-1/4 h-[756px] bg-white rounded-lg shadow-md">
          <div className="w-full h-[366px] px-8 mt-8 mb-2">
            <Carousel>
              {images.map((image) => (
                <div key={image.Id}>
                  <img
                    className="rounded-lg overflow-hidden"
                    src={image.Image_URL}
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="w-full px-8 mb-8">
            <h2 className="text-xl text-left mb-4">Ownership Information</h2>
            <table>
              <tbody>
                <tr>
                  <td className="font-bold align-text-top w-24">Name: </td>
                  <td>{property?.Name}</td>
                </tr>
                <tr>
                  <td className="font-bold align-text-top w-24">Address: </td>
                  <td>{property?.Address}</td>
                </tr>
                <tr>
                  <td className="font-bold align-text-top w-24">City: </td>
                  <td>
                    {property?.City} - {property?.Zip_Code}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold align-text-top w-24">County: </td>
                  <td>{property?.County}</td>
                </tr>
                <tr>
                  <td className="font-bold align-text-top w-24">Phone: </td>
                  <td>
                    <FontAwesomeIcon fontSize={14} icon={faPhone} />
                    <span className="ml-2">{property?.Phone}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex w-full px-8 mb-12">
            <div className="w-3/4">
              <h2 className="text-xl text-left mb-4">Facility Description</h2>
              <table>
                <tbody>
                  <tr>
                    <td className="font-bold align-text-top w-24">Type:</td>
                    <td>{property?.Type}</td>
                  </tr>
                  <tr>
                    <td className="font-bold align-text-top w-24">Capacity:</td>
                    <td>{property?.Capacity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col justify-end items-end w-1/4">
              <Link href={`/`} className="text-red-800">
                <FontAwesomeIcon fontSize={14} icon={faChevronLeft} />
                <span className="ml-2">Back</span>
              </Link>
            </div>
          </div>
        </div>

        {loaded && (
          <div className="flex flex-col items-center justify-start w-3/4 h-full">
            <MapComponent address={property?.Address} loaded={loaded} />
          </div>
        )}
      </div>
    </div>
  );
}
