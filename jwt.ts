import { createRemoteJWKSet, errors, jwtVerify } from 'jose'
import { Issuer } from 'openid-client'

export type ValidationError<ErrorTypes extends string> = {
    errorType: ErrorTypes
    message: string
    error?: Error | unknown
}

export async function verifyJwt(
    bearerToken: string
) {
    const tokenXIssuer = await Issuer.discover(process.env.TOKEN_X_WELL_KNOWN_URL!)
    console.log(`discovered: ${JSON.stringify(tokenXIssuer)}`)
    const remoteJWKSet = createRemoteJWKSet(new URL(<string>tokenXIssuer.jwks_uri))
    const token = bearerToken.replace('Bearer ', '')

    try {
        return jwtVerify(token, await remoteJWKSet(), {
            issuer: tokenXIssuer.metadata.issuer,
            algorithms: ['RS256'],
            audience: "dev-gcp:frontend-golden-path:frontend-golden-path"  
        })
    } catch (err) {
        if (err instanceof errors.JWTExpired) {
            return {
                errorType: 'EXPIRED',
                message: err.message,
                error: err,
            }
        }

        if (err instanceof errors.JOSEError) {
            return {
                errorType: 'UNKNOWN_JOSE_ERROR',
                message: err.message,
                error: err,
            }
        }

        throw err
    }
}
