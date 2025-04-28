import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token manquant" });
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, "votre_secret_jwt");
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
}
