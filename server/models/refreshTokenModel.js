import db from '../helpers/db.js';

const refreshTokens = {
    add: async function (userID, hashedToken, expiration) {
    const result = await db.query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3) RETURNING id',
        [userID, hashedToken, expiration]
    );

    return result.rows[0];
    },

    verify: async function(userID, hashedToken){
        return await db.query(
            `SELECT id FROM refresh_tokens
            WHERE user_id=$1 AND token_hash=$2 AND revoked_at IS NULL AND expires_at>now()
            LIMIT 1`,
            [userID, hashedToken]
        );
    },

    revoke: async function (userID, hashedToken) {
        return await db.query(
            'UPDATE refresh_tokens SET revoked_at=now() WHERE user_id=$1 AND token_hash=$2 AND revoked_at IS NULL',
            [userID, hashedToken]
        );
    }
}
export default refreshTokens;