module.exports = (error, req, res, next) => {
    if (error instanceof SyntaxError) {
        res.status(500).json({ message: "Something Went Wrong" });
    } else {
        next();
    }
};
