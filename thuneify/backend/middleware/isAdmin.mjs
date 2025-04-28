export function isAdmin(req, res, next) {
  console.log('isAdmin middleware - req.user:', req.user);
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Accès refusé (admin uniquement)" });
}
