export default function starCardNumbers (cardNumber: string): string {
  if (cardNumber.length > 12) {
    const firstFour = cardNumber.substring(0,4)
    const lastFour = cardNumber.substring(cardNumber.length - 4)
    return firstFour + "*".repeat(cardNumber.length - 8) + lastFour
  } else {
    return "*".repeat(cardNumber.length)
  }
}
