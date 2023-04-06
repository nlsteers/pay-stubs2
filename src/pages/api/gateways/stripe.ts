import type {NextApiRequest, NextApiResponse} from "next";
import doAuthorise from "../../../middleware/doAuthorise";

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  res.status(501).json({ response: 'not implemented' })
}

export default doAuthorise(handler)
