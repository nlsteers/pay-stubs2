import type {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"

const { serverRuntimeConfig } = getConfig()

const STUBS_USER = serverRuntimeConfig.stubsUsername
const STUBS_PASSWORD = serverRuntimeConfig.stubsPassword

type basicAuthObject = {
  username: string,
  password: string
}

const validateBasicAuth = (authObject: basicAuthObject): boolean => {
  return authObject.username === STUBS_USER && authObject.password === STUBS_PASSWORD
}

const decodeAuthHeader = (authHeader: string): basicAuthObject => {
  if (authHeader !== undefined) {
    let parts = authHeader.split(" ")
    if (parts.at(0) === "Basic") {
      try {
        let authParts = Buffer.from(parts.at(1)!, 'base64').toString().split(":")
        return {
          username: authParts.at(0)!,
          password: authParts.at(1)!
        }
      } catch (err) {
        throw new Error("error occurred decoding authorisation")
      }
    } else {
      throw new Error("unexpected authorisation type")
    }
  } else {
    throw new Error("authorisation required")
  }
}

const doAuthorise = (handler: Function) => {
  return async (req: NextApiRequest , res: NextApiResponse) => {
    // get auth headers
    // if present and if match return handler
    // else return 401
    try {
      let authObject = decodeAuthHeader(req.headers["authorization"]!)
      if (validateBasicAuth(authObject)) {
        return handler(req, res)
      } else {
        throw new Error("authorisation object did not match expected values")
      }
    } catch (err) {
      if (err instanceof Error) {
        console.warn("WARN:", err.message)
      } else {
        console.error("ERROR:", err)
      }
      return res.status(401).json({
        message: "authorisation failed"
      })
    }
  }
}

export default doAuthorise;
