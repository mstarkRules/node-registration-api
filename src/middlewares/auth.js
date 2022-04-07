const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  //checks if there is an authorization token in the header
  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  }

  //splits the token parts to check each one
  const parts = authHeader.split(" ");

  //checks if there is 2 parts in the splited token
  if (!parts.length === 2) {
    return res.status(401).send({ error: "Token error" });
  }

  const [scheme, token] = parts;

  //uses reges to checks if word 'Bearer' existis in header
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "Token malformatted" });
  }

  //jwt checks if provided token is valid
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Token invalid" });
    }
    req.userId = decoded.id;

    return next();
  });
};
