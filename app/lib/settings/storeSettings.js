const { Op } = require("sequelize");
const Models = require("../../models");

module.exports = async (settings, requestLv = 99) => {
    const successed = [];
    for (const label in settings) {
        const updateResult = await Models.settings.update(
            { value: settings[label] },
            {
                where: {
                    label,
                    edit_level: { [Op.lte]: requestLv },
                    type: { [Op.or]: ["string", typeof settings[label]] },
                },
            }
        );
        if (updateResult[0]) successed.push(label);
    }

    return successed;
};
