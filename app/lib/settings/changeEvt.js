const Events = {};

module.exports = {
    Events,
    add: function (label, evtInfo) {
        const Smbl = Symbol();
        if (!Events[label]) Events[label] = new Map();

        Events[label].set(Smbl, evtInfo);
    },
    remove: function (smbl, label = null) {
        if (!label) label = this._findLabelWithSmbl(smbl);
        if (Events[label]) return false;
        return Events[label].delete(smbl);
    },
    _findLabelWithSmbl: function (smbl) {
        return Object.keys(Events).find((k) => {
            Events[k].has(smbl);
        });
    },
    _call: function (label, value, isInit = false) {
        if (Events[label])
            Events[label].forEach((v) => {
                if (isInit && !v.init) return;

                if (typeof v === "function") v(value);
                else v.cb(value);
            });
    },
};
