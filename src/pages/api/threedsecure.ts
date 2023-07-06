import type {NextApiRequest, NextApiResponse} from "next"
import React from "react";
import ThreeDSecureSimulator, {ThreeDSProps} from "../3ds-simulator"
import ReactDOMServer from "react-dom/server";

const PA_RES = 'eJx9UsFugzAMve8rEPc2JECLkJuKiVbi0KpambQrAotGKtAlUHV/P8O6wjRtviR+frafncD6Vp2tK2qjmnpl87ljW1jnTaHqcmW/pttZYK8lpCeNGB8x7zRK2KExWYmWKijDC3zXcxeey3lgSzhEL2h+R+ZGlTUWRLj3ktRqLoB9u1RU56esbiVk+ftzspd8NGB3DCrUSTwN9TYbeV9xYGO1Q9ffDMm+qUIm0Z+2AtYzoMhalMLhS4cL3+I8FMtQuMAGHC59uahqOqrt+ktgUwBoP5rW9yEDsQD28ABvl6ZGYtDEjzuwUdsh2ktnYp7wiNqjkL5JaFX10LSwuBcKETrUfMDBtFnbGZnEm32abJNNDOwOQZ5dr3L379ADBTBX0vFJHZ1DVnQuG63aU9Vr/gkA6zWx4aklHOllqZlGNux9+Bo9Zfplnj4B7Re73w=='
const AUTHORISATION_FAILED_PA_VALUE = 'authorisation_fail'

const getPaResponse = (paRequest: string) => {
  if (paRequest === AUTHORISATION_FAILED_PA_VALUE) {
    return AUTHORISATION_FAILED_PA_VALUE
  }
  return PA_RES
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body)

  const orderCode = Array.isArray(req.query['orderCode']) ? req.query['orderCode'][0] : req.query['orderCode']
  const data: ThreeDSProps = {
    md: req.body.MD,
    paReq: req.body.PaReq,
    paRes: getPaResponse(req.body.PaReq),
    termUrl: req.body.TermUrl,
    orderCode: orderCode
  }
  const element = React.createElement(ThreeDSecureSimulator, data)
  if (req.headers.accept === "application/json") {
    res.json(data)
  } else {
    const threeDSComponent = ReactDOMServer.renderToString(element)
    const html = `
      <html lang="en">
        <head>
          <title>GOV.UK Pay Stubs - 3DS</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/alphagov/govuk-frontend@4.5.0/dist/govuk-frontend-4.5.0.min.css">
        </head>
        <body>
          <div class="govuk-width-container">
            <main class="govuk-main-wrapper">
              ${threeDSComponent}
            </main>
          </div>
        </body>
      </html>
      `
    res.status(200)
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 'no-cache')
      .send(html)
  }
}

export default handler
