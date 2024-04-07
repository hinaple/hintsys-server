const changeEvt = require("../settings/changeEvt");

let ALLOWED_EXTENSIONS = [];
let FILESIZE_LIMIT_MB = 0;

changeEvt.add("max-file-mb", {
    cb: (v) => {
        if (isNaN(v)) return;
        FILESIZE_LIMIT_MB = +v;
        console.log(`\n### UPLOAD SIZE LIMIT IS ${v} NOW. ###\n`);
    },
    init: true,
});
changeEvt.add("allow-upload-ext", {
    cb: (v) => {
        ALLOWED_EXTENSIONS = v.toLowerCase().split("|");
        console.log(
            `\n### ${ALLOWED_EXTENSIONS.join(
                ","
            )} ARE ABLE TO BE UPLOADED NOW. ###\n`
        );
    },
    init: true,
});

module.exports = (file, ext) => {
    ALLOWED_EXTENSIONS.includes(ext) &&
        file.size <= FILESIZE_LIMIT_MB * 1000000;
};
