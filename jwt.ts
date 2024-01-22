import { createRemoteJWKSet, errors, jwtVerify } from 'jose'
import { Issuer } from 'openid-client'

const tokenXIssuer = await Issuer.discover(process.env.TOKEN_X_WELL_KNOWN_URL!)
const remoteJWKS = await createRemoteJWKSet(new URL(<string>tokenXIssuer.jwks_uri))
const options = {
    issuer: tokenXIssuer.metadata.issuer,
    audience: `bogus${process.env.NAIS_CLUSTER_NAME}:${process.env.NAIS_NAMESPACE}:${process.env.NAIS_APP_NAME}`
    // TODO validate other claims as needed
};

export type ValidationError<ErrorTypes extends string> = {
    errorType: ErrorTypes
    message: string
    error?: Error | unknown
}

export async function verifyJwt(
    bearerToken: string
) {
    const token = bearerToken.replace('Bearer ', '')

    try {
        return await jwtVerify(token, remoteJWKS, options)
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

        return {
            errorType: 'OTHER_ERROR',
            message: 'unknown error occured',
            error: err,
        }
    }
}
