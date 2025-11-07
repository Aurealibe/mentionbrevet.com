const fs = require("fs");
const path = require("path");

// Configuration
const INPUT_CSV_PATH = path.join(__dirname, "../dataset.csv");
const OUTPUT_DIR = path.join(__dirname, "../public/data");
const OUTPUT_JSON_PATH = path.join(OUTPUT_DIR, "dataset.json");
const MIN_COUNT_THRESHOLD = 10;

// Fonction pour parser une ligne CSV
function parseCSVLine(line) {
  const matches = line.match(/("(?:[^"]|"")*"|[^,]*)/g);
  return matches
    ? matches.map((field) => {
        // Supprimer les guillemets en début et fin
        field = field.replace(/^"/, "").replace(/"$/, "");
        // Remplacer les doubles guillemets par des guillemets simples
        field = field.replace(/""/g, '"');
        return field;
      })
    : [];
}

// Fonction pour convertir les données
function convertCSVToJSON() {
  console.log("🚀 Conversion CSV → JSON en cours...");

  try {
    // Lire le fichier CSV
    if (!fs.existsSync(INPUT_CSV_PATH)) {
      throw new Error(`Fichier CSV non trouvé: ${INPUT_CSV_PATH}`);
    }

    const csvContent = fs.readFileSync(INPUT_CSV_PATH, "utf-8");
    const lines = csvContent.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      throw new Error(
        "Le fichier CSV doit contenir au moins un header et une ligne de données"
      );
    }

    // Parser le header
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);
    console.log("📋 Headers détectés:", headers);

    // Vérifier que nous avons toutes les colonnes nécessaires
    const requiredColumns = [
      "firstname",
      "count",
      "taux_sm",
      "taux_ab",
      "taux_b",
      "taux_tb",
      "taux_fel",
    ];
    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col)
    );

    if (missingColumns.length > 0) {
      throw new Error(`Colonnes manquantes: ${missingColumns.join(", ")}`);
    }

    // Parser les données
    const data = [];
    let filteredCount = 0;
    let totalCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const values = parseCSVLine(line);

        if (values.length !== headers.length) {
          console.warn(
            `⚠️  Ligne ${i + 1} ignorée: nombre de colonnes incorrect`
          );
          continue;
        }

        const row = {};
        headers.forEach((header, index) => {
          const value = values[index].trim();

          // Conversion des types
          if (header === "firstname") {
            row[header] = value;
          } else if (header === "count") {
            row[header] = parseInt(value, 10);
          } else if (header.startsWith("taux_")) {
            row[header] = parseFloat(value);
          } else {
            row[header] = value;
          }
        });

        totalCount++;

        // Filtrer par le seuil minimum
        if (row.count >= MIN_COUNT_THRESHOLD) {
          // Validation des données
          if (
            row.firstname &&
            typeof row.count === "number" &&
            !isNaN(row.count) &&
            typeof row.taux_sm === "number" &&
            !isNaN(row.taux_sm) &&
            typeof row.taux_ab === "number" &&
            !isNaN(row.taux_ab) &&
            typeof row.taux_b === "number" &&
            !isNaN(row.taux_b) &&
            typeof row.taux_tb === "number" &&
            !isNaN(row.taux_tb) &&
            typeof row.taux_fel === "number" &&
            !isNaN(row.taux_fel)
          ) {
            data.push(row);
            filteredCount++;
          } else {
            console.warn(
              `⚠️  Ligne ${i + 1} ignorée: données invalides pour ${
                row.firstname
              }`
            );
          }
        }
      } catch (error) {
        console.warn(`⚠️  Erreur ligne ${i + 1}: ${error.message}`);
      }
    }

    // Trier par count décroissant
    data.sort((a, b) => b.count - a.count);

    // Créer le dossier de sortie s'il n'existe pas
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Créer l'objet de sortie avec métadonnées
    const output = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalRecords: totalCount,
        filteredRecords: filteredCount,
        minCountThreshold: MIN_COUNT_THRESHOLD,
        version: "1.0.0",
      },
      data: data,
    };

    // Écrire le fichier JSON
    fs.writeFileSync(
      OUTPUT_JSON_PATH,
      JSON.stringify(output, null, 2),
      "utf-8"
    );

    console.log("✅ Conversion terminée avec succès!");
    console.log(`📊 Statistiques:`);
    console.log(`   - Total lignes CSV: ${totalCount}`);
    console.log(
      `   - Prénoms filtrés (>= ${MIN_COUNT_THRESHOLD}): ${filteredCount}`
    );
    console.log(`   - Fichier généré: ${OUTPUT_JSON_PATH}`);
    console.log(
      `   - Taille: ${(fs.statSync(OUTPUT_JSON_PATH).size / 1024).toFixed(
        1
      )} KB`
    );

    // Afficher quelques exemples
    console.log("\n📝 Aperçu des données (top 5):");
    data.slice(0, 5).forEach((item, index) => {
      console.log(
        `   ${index + 1}. ${item.firstname}: ${item.count} occurrences`
      );
    });
  } catch (error) {
    console.error("❌ Erreur lors de la conversion:", error.message);
    process.exit(1);
  }
}

// Exécuter la conversion
if (require.main === module) {
  convertCSVToJSON();
}

module.exports = { convertCSVToJSON };
