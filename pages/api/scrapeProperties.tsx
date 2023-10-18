import { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom";

interface Property {
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

const webURLs: { [key: string]: string } = {
  delaney:
    "https://apps.hhs.texas.gov/LTCSearch/providerdetail.cfm?pid=106705&protype=Assisted%20Living&subtype=TYPE%20B&lang=EN",
  brookdale:
    "https://apps.hhs.texas.gov/LTCSearch/providerdetail.cfm?pid=030404&protype=Assisted%20Living&subtype=TYPE%20B&lang=EN",
};

/**
 * Collect data for a specified care provider
 *
 * @param careProvider identifier for the care provider
 */
const scrapeProperties = async (req: NextApiRequest, res: NextApiResponse) => {
  const properties: { [key: string]: Property } = {};

  for (let [key, webURL] of Object.entries(webURLs)) {
    const response = await fetch(webURL);
    const html = await response.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const mainParagraphContent = document!
      .querySelector(".fa-home")!
      .parentElement!.textContent!.split(/\r?\n/);
    const detailedCity = mainParagraphContent[1].split(",");
    const facilityDescription = document!
      .querySelector("#p7TP3c1_1")!
      .getElementsByTagName("ul")[0].children!;

    const Name = document.querySelector("h1.first")?.textContent!;
    const Address = mainParagraphContent[0].trim();
    const City = detailedCity[0].trim();
    const Zip_Code = detailedCity[1].split(" ")[2].trim()!;
    const County = mainParagraphContent[2].replace(" County", "");
    const Phone = mainParagraphContent[3].trim();
    const Type = facilityDescription[0].textContent!.split(":")[1].trim();
    const Capacity = facilityDescription[1].textContent!.split(":")[1].trim();

    const property: Property = {
      Name,
      Address,
      City,
      State: "Texas",
      Zip_Code: parseInt(Zip_Code),
      County,
      Phone,
      Type,
      Capacity: parseInt(Capacity),
    };

    properties[key] = property;
  }

  res.status(200).json({ properties });
};

export default scrapeProperties;
