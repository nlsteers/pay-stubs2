import type {NextApiRequest, NextApiResponse} from "next"
import { create } from "xmlbuilder2"
import { XMLParser, XMLValidator} from "fast-xml-parser"
import doAuthorise from "../../../middleware/doAuthorise"
import findValueByKey from "../../../util/findValueByKey"
import starCardNumbers from "../../../util/starCardNumbers";

type requestDetails = {
  getType: Function,
  transactionID: string,
  amount: number,
  version: number,
  merchantCode: string,
  cardNumber: string,
  cardHolderName: string
}

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

const determineRequestDetails = (parsedRequestBody: any): requestDetails => {
  delete parsedRequestBody['?xml']
  console.dir(parsedRequestBody, { depth: null })
  return {
    getType: () => {
      if (findValueByKey(parsedRequestBody, "paResponse")) return REQUEST_TYPE.AUTH_3DS_AUTHORISED_ORDER
      if (findValueByKey(parsedRequestBody, "shopper")) return REQUEST_TYPE.AUTH_3DS_REQUIRED_ORDER
      if (findValueByKey(parsedRequestBody, "order")) return REQUEST_TYPE.AUTH_ORDER
      if (findValueByKey(parsedRequestBody, "refund")) return REQUEST_TYPE.REFUND_ORDER
      if (findValueByKey(parsedRequestBody, "capture")) return REQUEST_TYPE.CAPTURE_ORDER
      return REQUEST_TYPE.UNKNOWN
    },
    transactionID: findValueByKey(parsedRequestBody, "@_orderCode"),
    amount: findValueByKey(parsedRequestBody, "@_value"),
    version: findValueByKey(parsedRequestBody, "@_version"),
    merchantCode: findValueByKey(parsedRequestBody, "@_merchantCode"),
    cardNumber: String(findValueByKey(parsedRequestBody, "cardNumber")),
    cardHolderName: findValueByKey(parsedRequestBody, "cardHolderName")
  }
}

const buildXMLResponse = (requestDetails: requestDetails, res: NextApiResponse) => {
  switch(requestDetails.getType()) {
    case REQUEST_TYPE.AUTH_ORDER:

      const root = create({ version: "1.0", encoding: "UTF-8" })
        .dtd({
          "pubID": "-//WorldPay//DTD WorldPay PaymentService v1//EN",
          "sysID": "http://dtd.worldpay.com/paymentService_v1.dtd"
        })
        .ele("paymentService", { version: requestDetails.version, merchantCode: requestDetails.merchantCode })
        .ele("reply")
        .ele("orderStatus", { orderCode: requestDetails.transactionID })
        .ele("payment")
        .ele("paymentMethod").txt("VISA-SSL").up()
        .ele("paymentMethodDetail")
        .ele("card", { number: starCardNumbers(requestDetails.cardNumber), type: "creditcard" })
        .ele("expiryDate")
        .ele("date", { month: "blah", year: "blah" }).up()
        .up()
        .up()
        .up()
        .ele("amount", { value: requestDetails.amount, currencyCode: "GBP", exponent: "2", debitCreditIndicator: "credit"}).up()
        .ele("lastEvent").txt("AUTHORISED").up()
        .ele("AuthorisationId", { id: "666" }).up()
        .ele("CVCResultCode", { description: "NOT SENT TO ACQUIRER" }).up()
        .ele("AVSResultCode", { description: "NOT SENT TO ACQUIRER" }).up()
        .ele("cardHolderName")
        .dat(requestDetails.cardHolderName).up()
        .ele("issuerCountryCode").txt("N/A").up()
        .ele("balance", { accountType: "IN_PROCESS_AUTHORISED" })
        .ele("amount", { value: requestDetails.amount, currencyCode: "GBP", exponent: "2", debitCreditIndicator: "credit"}).up()
        .up()
        .ele("riskScore", { value: "51" }).up()
        .ele("cardNumber").txt( starCardNumbers(requestDetails.cardNumber) )

      const xml = root.end({ prettyPrint: true })

      res
        .status(200)
        .setHeader('Content-Type', 'text/xml')
        .send(xml)
      break;
    case REQUEST_TYPE.CAPTURE_ORDER:
      // reply with capture confirm
      // add capture notification to queue
      res.status(200).json({ message: requestDetails, type: requestDetails.getType() })
      break;
    default:
      res.status(400).json({ message: "Unknown request type" })
  }
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // construct response
  // add capture confirmed notification to queue if capture submission

  if (XMLValidator.validate(req.body, { allowBooleanAttributes: true })) {
    const parsedRequestBody = parser.parse(req.body)
    const requestDetails = determineRequestDetails(parsedRequestBody)
    buildXMLResponse(requestDetails, res)
  } else {
    res.status(400).json({ message: "XML error" })
  }
}

export default doAuthorise(handler)
