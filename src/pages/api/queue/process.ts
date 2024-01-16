import {ReceiveMessageCommand, DeleteMessageBatchCommand, SQSClient, Message} from "@aws-sdk/client-sqs"
import getConfig from "next/config"
import axios from "axios"
import type {NextApiRequest, NextApiResponse} from "next"
import type {DeleteMessageBatchRequestEntry} from "@aws-sdk/client-sqs/dist-types/models/models_0"

const { serverRuntimeConfig } = getConfig()

const CONNECTOR_URL = serverRuntimeConfig.connectorUrl

const QUEUE_URL = '/000000000000/capture'
const DEAD_LETTER_URL = '/000000000000/capture-dead-letters'

const sqsClient = new SQSClient({
  region: 'elasticmq',
  endpoint: 'http://localhost:9324',
  credentials: {
    accessKeyId: 'x',
    secretAccessKey: 'x'
  },
})

const receiveMessage = async (deadLetter = false) => {
  const command = new ReceiveMessageCommand({
    QueueUrl: deadLetter ? DEAD_LETTER_URL : QUEUE_URL
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

const processMessages = async (messages: Message[]) => {
  return await Promise.all(
    messages.map(async (msg) => {
      try {
        await axios.post(CONNECTOR_URL, { message: msg.Body })
        return {
          Id: msg.MessageId,
          ReceiptHandle: msg.ReceiptHandle
        }
      } catch (error) {
        if (axios.isAxiosError(error))  {
          console.error(`error sending to connector [code ${error.code}] [message id ${msg.MessageId}]`)
        } else {
          console.error(`error processing message ${msg.MessageId}`)
        }
        return null
      }
    })
  )
}

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  await receiveMessage(true).then(commandRes => {
    const messages = commandRes.Messages
    if (messages && messages.length > 0) {
      console.warn()
    }
  })
  await receiveMessage().then(commandRes => {
    const messages = commandRes.Messages
    if (messages && messages.length > 0) {
      processMessages(messages)
        .then((result) => {
          if (result === null) {
            clearMessage(result)
          }
        })
        .catch((error) => {
          console.error('an error occurred:', error)
        })
      res.status(200).json(commandRes.Messages)
    } else {
      res.status(200).json({message: "queue empty"})
    }
  }).catch(err => {
    res.status(400).json(err.message)
  })
}

export default handler
