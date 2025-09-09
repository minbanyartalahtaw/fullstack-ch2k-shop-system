import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "e4c3b6a9d2f1e8c7b4a5d6e3f2c1b8a7"); // keep in .env

// Create JWT
export async function signJwt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7h") // adjust expiry
        .sign(secret);
}

// Verify JWT
export async function verifyJwt(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (err) {

        console.error("JWT verification failed:", err);
        return null;
    }
}
