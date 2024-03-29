import {create} from "xmlbuilder2"
import type {WorldpayNotification, WorldpayRequestDetails} from "../types/worldpay"
import starCardNumbers from "../starCardNumbers"
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

const THREEDS_URL = publicRuntimeConfig.threeDSUrl

const PA_REQ = "eJxVUttuwjAM/ZWI59GQtECFTFCBifHAhjZ+oEsNrUYvpCkFvn5JuRScPNjnOHZ8gckp3ZMjqjLJs3GHOb0OmQjYxApx/oOyUihghWUZ7pAkkfHw/L7ruQPPZczvCFgH33gQcIsgTACHA72b5qmScZhpAaE8TJefgrUC9IZBimo5f6asdFu/Kw9FWJZ1riLBuOv1B0Mf6AOCLExRzMLfJENNvrbbRCLpkkVuvpKlCLThQeZVptVZ+HwA9G5ApfYi1roYUVrXtbPLj071B9TCQNsS1pXVShPmlERidQn46vJ++tzI82oXPMsYqPWAKNQoeI8Ne4z3CWMjPhxxF2iDQ5ja/GIxXRP3rT807bgCUNg8wdVwLfEMgJmJwkzea7hbgKciz9B4mP4/dIiwlGITJyUxV8dILKCSQpvxmI9YFmhb2OzDTkpq026Pvx47roawmRLTNub3/CaVNYDap/S2DvS2MkZ7WaV/bXjH/w=="

const authOrderResponse = (requestDetails: WorldpayRequestDetails): string => {

  const paymentMethod = Object.keys(requestDetails.paymentDetails)[0]!
  const paymentDetails = requestDetails.paymentDetails[paymentMethod]!
  const root = create({version: "1.0", encoding: "UTF-8"})
    .dtd({
      "pubID": "-//WorldPay//DTD WorldPay PaymentService v1//EN",
      "sysID": "http://dtd.worldpay.com/paymentService_v1.dtd"
    })
    .ele("paymentService", {version: requestDetails.version, merchantCode: requestDetails.merchantCode})
    .ele("reply")
    .ele("orderStatus", {orderCode: requestDetails.orderCode})
    .ele("payment")
    .ele("paymentMethod").txt(paymentMethod)
    .up()
    .ele("paymentMethodDetail")
    .ele("card", {number: starCardNumbers(paymentDetails.cardNumber), type: "creditcard"})
    .ele("expiryDate")
    .ele("date", {month: paymentDetails.expiryDate.date.month, year: paymentDetails.expiryDate.date.year})
    .up()
    .up()
    .up()
    .up()
    .ele("amount", {value: requestDetails.amount, currencyCode: "GBP", exponent: "2", debitCreditIndicator: "credit"})
    .up()
    .ele("lastEvent").txt("AUTHORISED")
    .up()
    .ele("AuthorisationId", {id: "666"})
    .up()
    .ele("CVCResultCode", {description: "NOT SENT TO ACQUIRER"})
    .up()
    .ele("AVSResultCode", {description: "NOT SENT TO ACQUIRER"})
    .up()
    .ele("cardHolderName")
    .dat(paymentDetails.cardHolderName).up()
    .ele("issuerCountryCode").txt("N/A").up()
    .ele("balance", {accountType: "IN_PROCESS_AUTHORISED"})
    .ele("amount", {
      value: requestDetails.amount,
      currencyCode: "GBP",
      exponent: "2",
      debitCreditIndicator: "credit"
    }).up()
    .up()
    .ele("riskScore", {value: "51"}).up()
    .ele("cardNumber").txt(starCardNumbers(paymentDetails.cardNumber))

  return root.end({prettyPrint: true})
}

const captureOrderResponse = (requestDetails: WorldpayRequestDetails): string => {
  const root = create({version: "1.0", encoding: "UTF-8"})
    .dtd({
      "pubID": "-//WorldPay//DTD WorldPay PaymentService v1//EN",
      "sysID": "http://dtd.worldpay.com/paymentService_v1.dtd"
    })
    .ele("paymentService", {version: requestDetails.version, merchantCode: requestDetails.merchantCode})
    .ele("reply")
    .ele("ok")
    .ele("captureReceived", {orderCode: requestDetails.orderCode})
    .ele("amount", {
      value: requestDetails.amount,
      currencyCode: "GBP",
      exponent: "2",
      debitCreditIndicator: "credit"
    }).up()

  return root.end({prettyPrint: true})
}

const threeDSecureRequiredResponse = (requestDetails: WorldpayRequestDetails): string => {
  const root = create({version: "1.0", encoding: "UTF-8"})
    .dtd({
      "pubID": "-//WorldPay//DTD WorldPay PaymentService v1//EN",
      "sysID": "http://dtd.worldpay.com/paymentService_v1.dtd"
    })
    .ele("paymentService", {version: requestDetails.version, merchantCode: requestDetails.merchantCode})
    .ele("reply")
    .ele("orderStatus", {orderCode: requestDetails.orderCode})
    .ele("requestInfo")
    .ele("request3DSecure")
    .ele("paRequest").txt(PA_REQ).up()
    .ele("issuerURL")
    .dat(`${THREEDS_URL}/api/threedsecure`).up()
    .up()
    .up()
    .ele("echoData").txt("125840479195919")

  return root.end({prettyPrint: true})
}

/*
<!DOCTYPE paymentService PUBLIC "-//WorldPay//DTD WorldPay PaymentService v1//EN"
        "http://dtd.worldpay.com/paymentService_v1.dtd">
<paymentService version="1.4" merchantCode="MERCHANTCODE">
<notify>
        <orderStatusEvent orderCode="{{transactionId}}">
            <payment>
                <paymentMethod>VISA-SSL</paymentMethod>
                <paymentMethodDetail>
                    <card type="creditcard"/>
                </paymentMethodDetail>
                <amount value="5000" currencyCode="GBP" exponent="2" debitCreditIndicator="credit"/>
                <lastEvent>{{status}}</lastEvent>
                <CVCResultCode description="NOT SENT TO ACQUIRER"/>
                <AVSResultCode description="NOT SENT TO ACQUIRER"/>
                <cardHolderName><![CDATA[J. Shopper]]></cardHolderName>
                <issuerCountryCode>N/A</issuerCountryCode>
                <balance accountType="IN_PROCESS_CAPTURED">
                    <amount value="5000" currencyCode="GBP" exponent="2" debitCreditIndicator="credit"/>
                </balance>
                <riskScore value="66"/>
            </payment>
            <journal journalType="{{status}}">
                <bookingDate>
                    <date dayOfMonth="{{bookingDateDay}}" month="{{bookingDateMonth}}" year="{{bookingDateYear}}"/>
                </bookingDate>
                <accountTx accountType="IN_PROCESS_AUTHORISED" batchId="23">
                    <amount value="5000" currencyCode="GBP" exponent="2" debitCreditIndicator="debit"/>
                </accountTx>
                <accountTx accountType="IN_PROCESS_CAPTURED" batchId="25">
                    <amount value="5000" currencyCode="GBP" exponent="2" debitCreditIndicator="credit"/>
                </accountTx>
                <journalReference type="capture" reference="{{refund-ref}}"/>
            </journal>
        </orderStatusEvent>
    </notify>

 */


const captureNotification = (worldpayNotification: WorldpayNotification) => {
  const root = create({version: "1.0", encoding: "UTF-8"})
    .dtd({
      "pubID": "-//WorldPay//DTD WorldPay PaymentService v1//EN",
      "sysID": "http://dtd.worldpay.com/paymentService_v1.dtd"
    })
    .ele("paymentService", {version: worldpayNotification.version, merchantCode: worldpayNotification.merchantCode})
    .ele("notify")
    .ele("orderStatus", {orderCode: worldpayNotification.orderCode})
    .ele("payment")
    .ele("paymentMethod").up()
    .ele("paymentMethodDetail")
    .ele("card", {type: "creditcard"}).up().up()
    .ele("amount", {
      value: worldpayNotification.amount,
      currencyCode: "GBP",
      exponent: "2",
      debitCreditIndicator: "credit"
    }).up()
    .ele("lastEvent").txt(worldpayNotification.status).up()
    .ele("cardHolderName").dat(worldpayNotification.cardHolderName).up()
  return root.end({prettyPrint: true})
}

export {
  authOrderResponse,
  captureOrderResponse,
  threeDSecureRequiredResponse,
  captureNotification
}
