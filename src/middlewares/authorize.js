import jwt from "jsonwebtoken"

export const fetchAuthorize = (req, res, next) => {
    const authheader = req.headers.authorization;
    if (!authheader) {
        return res.status(401).send({
            message: 'Unauthorized'
        });
    }

    const token = authheader.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            message: 'Unauthorized'
        });
    }

    jwt.verify(token, process.env.JWT_PRIVATE_SECRET, err => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized'
            });
        }
        next();
    });
}