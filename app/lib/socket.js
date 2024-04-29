const { Server } = require("socket.io");
const env = require("./nodeEnv");
const areIdPwAvail = require("./authEndpoint/areIdPwAvail");
const getAllowed = require("./getAllowed");

let io;

function clearRoom(target) {
    for (const room of target.rooms) {
        if (room !== target.id) {
            target.leave(room);
        }
    }
}

module.exports = {
    start: (http) => {
        io = new Server(http, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
            pingInterval: 5000,
        });
        io.on("connection", (socket) => {
            socket.on("setTheme", async (data, cb) => {
                const auth = await areIdPwAvail(
                    data.account.id,
                    data.account.pw
                );
                if (!auth[0]) return;
                const allowed = getAllowed(auth[1]);
                if (allowed && !allowed.includes(data.idx)) return;

                clearRoom(socket);
                socket.join(`theme_${data.idx}`);
                socket.emit("joinedTheme");
                cb();
            });
            socket.on("leaveRooms", (cb) => {
                clearRoom(socket);
                cb();
            });
        });
    },
    getRooms: () => [...io.sockets.adapter.rooms.keys()],
    execute: (method, themeIdx) =>
        io.in(`theme_${themeIdx}`).timeout(1000).emitWithAck(method),
};
