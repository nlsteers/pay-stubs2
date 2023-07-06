import {GetQueueAttributesCommand, SQSClient} from "@aws-sdk/client-sqs"
import type {NextApiRequest, NextApiResponse} from "next"

const sqsClient = new SQSClient({
  region: "elasticmq",
  endpoint: "http://localhost:9324",
  credentials: {
    accessKeyId: 'x',
    secretAccessKey: 'x'
  },
})

const getQueueAttributes = async () => {
  const command = new GetQueueAttributesCommand({
    QueueUrl: '/000000000000/capture',
    AttributeNames: ["ApproximateNumberOfMessagesDelayed", "ApproximateNumberOfMessagesNotVisible", "ApproximateNumberOfMessages"]
  })

  return await sqsClient.send(command)
}

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  await getQueueAttributes().then(commandRes => {
    res.status(200).json({attributes: commandRes.Attributes})
  }).catch(err => {
    res.status(400).json(err.message)
  })
}

export default handler
