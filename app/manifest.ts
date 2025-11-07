import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MentionBrevet.com - Statistiques du Brevet par Prénom",
    short_name: "MentionBrevet",
    description:
      "Découvrez les statistiques officielles du brevet des collèges 2025 par prénom. Analysez les taux de mentions et explorez les corrélations.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    scope: "/",
    categories: ["education", "reference", "utilities"],
    lang: "fr",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Rechercher un prénom",
        short_name: "Recherche",
        description: "Rechercher directement un prénom",
        url: "/?focus=search",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
