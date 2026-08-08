const jwt = require('jsonwebtoken');

const SECRET_KEY = 'bellatime_secret_key';

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            message: 'Token manquant'
        });

    }

    try {

        const token =
            authHeader.replace('Bearer ', '');

        const decoded =
            jwt.verify(token, SECRET_KEY);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: 'Token invalide'
        });

    }

};

module.exports = auth;