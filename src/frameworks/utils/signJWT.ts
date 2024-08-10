import * as jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "nothing";

// Sign JWT
export function signJWT(payload: object, expiresIn: string | number): string {
    const accessToken = jwt.sign(payload, JWT_SECRET);
    return accessToken;
}

// Verify JWT
export function verifyJWT<T>(token: string): T | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as T;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return null;
        } else {
            console.error("JWT Verification Error:", error);
            throw new Error("JWT Verification Error");
        }
    }
}