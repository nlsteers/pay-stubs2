type WorldpayRequestDetails = {
  getType: () => string,
  orderCode: string
  merchantCode: string
  version: number
  amount: number
  paymentDetails: {
    [key: string]: {
      cardNumber: string
      expiryDate: {
        date : {
          month: number
          year: number
        }
      },
      cardHolderName: string
      cvc: number
    }
  }
}

export type {
  WorldpayRequestDetails
}
