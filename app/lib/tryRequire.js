module.exports = (req, module) => {
    try {
        const m = req(module);
        return m;
    } catch (err) {
        return undefined;
    }
};
