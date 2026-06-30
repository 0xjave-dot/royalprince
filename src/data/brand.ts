import { mixHex } from "../lib/colorTheme";

export const brandName = "Royal Prince Fashion";
export const brandShortName = "Royal Prince";
export const brandLogoUrl = "https://i.ibb.co/fVtXq9WY/443733999-1157233125694237-1386259976080669830-n.jpg";
export const brandFaviconUrl = brandLogoUrl;
export const brandInstagramUrl = "https://www.instagram.com/royalprincefashion_/";
export const brandWhatsappNumber = "09068332470";
export const brandWhatsappPhone = "2349068332470";
export const brandWhatsappUrl = `https://api.whatsapp.com/send?phone=${brandWhatsappPhone}`;

export const brandLocations = [
  {
    label: "HQ",
    address: "51/53 Diya Street, Gbagada, Lagos",
  },
  {
    label: "Legend Supermarket",
    address: "Opp House on the Rock",
  },
  {
    label: "PRINCE Ebeano Supermarket",
    address: "Agungi",
  },
];

export const brandTheme = {
  accent: "#c21f2d",
  accentLight: mixHex("#c21f2d", "#ffffff", 0.88),
  accentLighter: mixHex("#c21f2d", "#ffffff", 0.95),
  shellBackground: "radial-gradient(circle_at_top, #fff1f2 0%, #fff8f8 34%, #fbf4f4 62%, #f5efef 100%)",
};
