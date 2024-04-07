const { _call } = require("./changeEvt");
const storeSettings = require("./storeSettings");

module.exports = async (settings, level) => {
    const changedLabels = await storeSettings(settings, level);
    for (const label of changedLabels) {
        _call(label, settings[label]);
    }
    return changedLabels;
};
