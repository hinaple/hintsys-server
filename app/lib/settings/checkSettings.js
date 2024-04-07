const Models = require("../../models");
const DefaultSettings = require("./DefaultSettings.json");
const { _call } = require("./changeEvt");

module.exports = async () => {
    console.log("\n\n===== Checking Settings ... =====\n");
    console.log(DefaultSettings);
    for (const label in DefaultSettings) {
        const ds = DefaultSettings[label];

        console.log(`=== Checking ${label} ===\n`);
        const s = await Models.settings.findOne({ where: { label } });

        let currentSettingValue = s?.value;

        if (!s) currentSettingValue = await whenNoSetting(ds, label);
        else {
            const updateObj = createUpdateObj(s, ds);
            if (Object.keys(updateObj).length) {
                console.log("--- There are Wrong setting on DB: ---\n");
                console.log(Object.keys(updateObj).join(","));

                console.log("--- Updating Data on DB... ---\n");

                try {
                    await Models.settings.update(updateObj, {
                        where: { label },
                    });
                    console.log("--- Updated! ---\n");
                } catch (err) {
                    console.log(`\n\n### An error occurred ###`);
                    console.log(`### while updating ${label}! ###\n\n`);
                    console.log(err.message);
                }
            }
        }

        console.log(
            `=== Calling events with value '${currentSettingValue}' ===\n`
        );
        _call(label, currentSettingValue, true);
    }
    console.log("===== Checking Setting is Done! =====\n\n");
    return;
};

async function whenNoSetting(ds, label) {
    console.log("--- Setting Not Found! ---");
    console.log("--- Creating Setting on DB... ---\n");
    try {
        await Models.settings.create({
            label,
            value: ds.default,
            type: typeof ds.default,
            read_level: ds.read_level,
            edit_level: ds.edit_level,
        });
        console.log("--- Created! ---\n\n");
    } catch (err) {
        console.log(`\n\n### An error occurred ###`);
        console.log(`### while creating ${label}! ###\n\n`);
        console.log(err.message);
    }
    return ds.default;
}

function createUpdateObj(s, ds) {
    const updateObj = {};
    if (s.read_level !== ds.read_level) updateObj.read_level = ds.read_level;
    if (s.edit_level !== ds.edit_level) updateObj.edit_level = ds.edit_level;
    if (s.type !== typeof ds.default) updateObj.type = typeof ds.default;
    if (typeof ds.default === "number" && isNaN(+s.value))
        updateObj.value = ds.default;

    return updateObj;
}
