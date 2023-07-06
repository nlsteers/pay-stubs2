import findValueByKey from "../util/findValueByKey";

describe("findValueByKey function", () => {

  const authObj = {
    "?xml": { "@_version": 1, "@_encoding": "UTF-8" },
    paymentService: {
      submit: {
        order: {
          description: "a payment",
          amount: { "@_currencyCode": "GBP", "@_exponent": 2, "@_value": 1000000 },
          paymentDetails: {
            "CARD-SSL": {
              cardNumber: 4242424242424242,
              expiryDate: { date: { "@_month": 12, "@_year": 2024 } },
              cardHolderName: "M. MONEYBAGS",
              cvc: 123
            }
          },
          randomNestedArray: [
            {
              nestedArrayKey: "nestedArrayValue1"
            },
            {
              nestedArrayKey: "nestedArrayValue2"
            }
          ],
          "@_orderCode": "123abc"
        }
      },
      "@_version": 1.4,
      "@_merchantCode": "NS2"
    }
  }

  it("should return the value if the key exists", () => {
    const result = findValueByKey(authObj, "@_merchantCode");
    expect(result).toEqual("NS2");
  })

  it("should return undefined if the key does not exist", () => {
    const result = findValueByKey(authObj, "random_key");
    expect(result).toBeUndefined()
  })

  it("should handle arrays correctly", () => {
    const result = findValueByKey(authObj, "nestedArrayKey")
    expect(result).toEqual("nestedArrayValue1")
  })

  it("should handle nested objects correctly", () => {
    const result = findValueByKey(authObj, "cardHolderName")
    expect(result).toEqual("M. MONEYBAGS")
  })
})
