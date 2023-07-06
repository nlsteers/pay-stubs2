import type {NextApiRequest, NextApiResponse} from "next"
import {XMLParser, XMLValidator} from "fast-xml-parser"
import doAuthorise from "../../../middleware/doAuthorise"
import findValueByKey from "../../../util/findValueByKey"
import {authOrderResponse, captureOrderResponse, threeDSecureRequiredResponse} from "../../../util/responses/worldpay"
import type {WorldpayRequestDetails} from "../../../util/types/worldpay"
import sendMessageToQueue from "../../../util/sendMessageToQueue"

const parser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  allowBooleanAttributes: true
})

const REQUEST_TYPE = {
  UNKNOWN: "unknown",
  AUTH_ORDER: "authorisation",
  AUTH_3DS_REQUIRED_ORDER: "authorisation3DSRequired",
  AUTH_3DS_AUTHORISED_ORDER: "authorisation3DSConfirmed",
  REFUND_ORDER: "refund",
  CAPTURE_ORDER: "capture"
}

const determineRequestDetails = (parsedRequestBody: any): WorldpayRequestDetails => {
  delete parsedRequestBody['?xml']
  // console.dir(parsedRequestBody, {depth: null})
  return {
    getType: () => {
      if (findValueByKey(parsedRequestBody, "paResponse")) return REQUEST_TYPE.AUTH_3DS_AUTHORISED_ORDER
      if (findValueByKey(parsedRequestBody, "shopper")) return REQUEST_TYPE.AUTH_3DS_REQUIRED_ORDER
      if (findValueByKey(parsedRequestBody, "order")) return REQUEST_TYPE.AUTH_ORDER
      if (findValueByKey(parsedRequestBody, "refund")) return REQUEST_TYPE.REFUND_ORDER
      if (findValueByKey(parsedRequestBody, "capture")) return REQUEST_TYPE.CAPTURE_ORDER
      return REQUEST_TYPE.UNKNOWN
    },
    orderCode: findValueByKey(parsedRequestBody, "@_orderCode"),
    merchantCode: findValueByKey(parsedRequestBody, "@_merchantCode"),
    amount: findValueByKey(parsedRequestBody, "@_value"),
    version: findValueByKey(parsedRequestBody, "@_version"),
    paymentDetails: findValueByKey(parsedRequestBody, "paymentDetails")
  }
}

const buildXMLResponse = async (requestDetails: WorldpayRequestDetails, res: NextApiResponse) => {

  switch (requestDetails.getType()) {
    case REQUEST_TYPE.AUTH_ORDER:
      console.log("AUTH_ORDER")
      res
        .status(200)
        .setHeader('Content-Type', 'text/xml')
        .send(authOrderResponse(requestDetails))
      break
    case REQUEST_TYPE.CAPTURE_ORDER:
      console.log("CAPTURE_ORDER")
      // reply with capture confirm
      res
        .status(200)
        .setHeader('Content-Type', 'text/xml')
        .send(captureOrderResponse(requestDetails))
      // add capture notification to queue
      const messageBody = {
        orderCode: requestDetails.orderCode,
        merchantCode: requestDetails.merchantCode,
        amount: requestDetails.amount
      }
      await sendMessageToQueue(messageBody)
      break
    case REQUEST_TYPE.AUTH_3DS_REQUIRED_ORDER:
      console.log("AUTH_3DS_REQUIRED_ORDER")
      res
        .status(200)
        .setHeader('Content-Type', 'text/xml')
        .send(threeDSecureRequiredResponse(requestDetails))
      break
    case REQUEST_TYPE.AUTH_3DS_AUTHORISED_ORDER:
      console.log("AUTH_3DS_AUTHORISED_ORDER")
      res.status(501).json({ response: 'not implemented' })
      break
    case REQUEST_TYPE.REFUND_ORDER:
      console.log("REFUND_ORDER")
      res.status(501).json({ response: 'not implemented' })
      break
    default:
      res.status(400).json({message: "Unknown request type"})
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // construct response
  // add capture confirmed notification to queue if capture submission
  if (XMLValidator.validate(req.body, {allowBooleanAttributes: true})) {
    const parsedRequestBody = parser.parse(req.body)
    const requestDetails = determineRequestDetails(parsedRequestBody)
    await buildXMLResponse(requestDetails, res)
  } else {
    res.status(400).json({message: "XML error"})
  }
}

export default doAuthorise(handler)
