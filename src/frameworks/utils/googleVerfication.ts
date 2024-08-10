import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config()
const clientId = process.env.CLIENT_ID;

async function verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
    try {
        const client = new OAuth2Client(clientId);
        const ticket: LoginTicket = await client.verifyIdToken({ idToken, audience: clientId });
        const payload: TokenPayload = ticket.getPayload() as TokenPayload;
        return payload;
    } catch (error) {
        console.error(error);
        throw new Error('Invalid ID token');
    }
}

export default verifyGoogleIdToken;