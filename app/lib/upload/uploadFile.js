const path = require("path");
const fs = require("fs").promises;

const checkFile = require("./checkUploadable");

module.exports = async (filename, file) => {
    const ext = path.extname(file.name);
    if (!checkFile(file, ext)) return false;
    const finalFilename = filename + ext;

    await fs.writeFile(
        path.join(__dirname, "..", "..", "public", "upload", finalFilename),
        file.data
    );
    return finalFilename;
};
