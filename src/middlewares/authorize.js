import jwt from "jsonwebtoken"

export const fetchAuthorize = (req, res, next) => {
    let token = req.headers.Authorization || req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            message: 'Unauthorized'
        });
    }

    if (token.startsWith('Bearer '))
        token = token.substr('Bearer '.length)

    jwt.verify(token, process.env.SECRET_KEY, err => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized'
            });
        }
        next();
    });
}