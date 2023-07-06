import {ReceiveMessageCommand, DeleteMessageBatchCommand, SQSClient} from "@aws-sdk/client-sqs"
import type {NextApiRequest, NextApiResponse} from "next"
import type {DeleteMessageBatchRequestEntry} from "@aws-sdk/client-sqs/dist-types/models/models_0";

const QUEUE_URL = '/000000000000/capture'

const sqsClient = new SQSClient({
  region: 'elasticmq',
  endpoint: 'http://localhost:9324',
  credentials: {
    accessKeyId: 'x',
    secretAccessKey: 'x'
  },
})

const receiveMessage = async () => {
  const command = new ReceiveMessageCommand({
    QueueUrl: QUEUE_URL
  })
  return await sqsClient.send(command)
}

const clearMessage = async (deleteBatch: DeleteMessageBatchRequestEntry[]) => {
  const command = new DeleteMessageBatchCommand({
    QueueUrl: QUEUE_URL,
    Entries: deleteBatch
  })

  return await sqsClient.send(command).then(res => console.log(res))
}

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  await receiveMessage().then(commandRes => {
    const messages = commandRes.Messages
    if (messages && messages.length > 0) {
      const deleteBatch: DeleteMessageBatchRequestEntry[] =  messages.map(msg => {
        return {
          Id: msg.MessageId,
          ReceiptHandle: msg.ReceiptHandle
        }
      })
      clearMessage(deleteBatch)
      res.status(200).json(commandRes.Messages)
    } else {
      res.status(200).json({message: "queue empty"})
    }
  }).catch(err => {
    res.status(400).json(err.message)
  })
}

export default handler
