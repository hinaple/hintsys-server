/**
 * @param {Object} obj
 * @param {Array[String]} keys
 * @param {Array[String]} exceptKeys
 *
 * @returns {Object}
 * cloned object but only contains keys which are in Array `keys`, but not in `exceptKeys`.
 */
module.exports = (obj, keys, exceptKeys = []) => {
    const resultObj = {};
    Object.keys(obj).forEach((k) => {
        if (keys.includes(k) && !exceptKeys.includes(k)) resultObj[k] = obj[k];
    });
    return resultObj;
};
