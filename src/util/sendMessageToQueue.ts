import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"

const sqsClient = new SQSClient({
  region: "elasticmq",
  endpoint: "http://localhost:9324",
  credentials: {
    accessKeyId: 'x',
    secretAccessKey: 'x'
  },
})
export default async function sendMessageToQueue(messageBody: object) {
  const command = new SendMessageCommand({
    QueueUrl: '/000000000000/capture',
    MessageBody: JSON.stringify(messageBody),
  })

  try {
    await sqsClient.send(command).then((res) =>  {
      console.log("Message sent:", res.MessageId)
    })
  } catch (error) {
    console.error("Error sending message:", error)
  }
}
