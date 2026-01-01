import jwt from "jsonwebtoken";

export async function authGuard(req, res) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send({ message: "No token" });

  const token = auth.replace("Bearer ", "");

  try {
    const payload = jwt.verify(
      token,
      process.env.SUPABASE_JWT_SECRET!
    );

    req.user = payload; // user_id, email, role
  } catch (e) {
    return res.status(401).send({ message: "Token expired" });
  }
}
