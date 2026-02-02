const xlsx = require("xlsx");

/* -------------------- PARSE EXCEL / CSV -------------------- */
exports.parseExcelFile = (filePath) => {
  try {
    // Read workbook
    const workbook = xlsx.readFile(filePath);

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Basic validation & normalization
    const formattedData = data.map((row) => ({
      title: row.title || row.Title,
      date: new Date(row.date || row.Date),
      time: row.time || row.Time,
      registrationLink:
        row.registrationLink || row.RegistrationLink,
      platform: row.platform || row.Platform || "Other",
      year: Number(row.year || row.Year),
    }));

    return formattedData;
  } catch (error) {
    throw new Error("Failed to parse Excel/CSV file");
  }
};
