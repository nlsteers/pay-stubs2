import {useEffect, useState} from "react"
import Notification from "../components/notification";
import ErrorSummary from "../components/errorSummary";

type QueueStatus = {
  attributes: {
    ApproximateNumberOfMessages: string,
    ApproximateNumberOfMessagesNotVisible: string,
    ApproximateNumberOfMessagesDelayed: string
  }
}

const QueueStatus = () => {

  const [queueStatus, setQueueStatus] = useState({} as QueueStatus)
  const [loading, setLoading] = useState(false)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await fetch('/api/queue/status')
      const json = await data.json() as QueueStatus
      setQueueStatus(json)
      setLoading(false)
    }

    fetchData()
      .catch((err) => {
        console.error(err)
        setLoading(false)
        setErrored(true)
      })
  }, [])

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        {loading ? <Notification type={"alert"} content={{title: "Loading", heading: "", body: "Please wait..."}}/> :
          <div>
            {errored ?
              <ErrorSummary summary={"There is a problem"} errors={["Error contacting queue api"]}/> :
              <div>
                <Notification type={"info"} content={{
                  title: "Queue Status",
                  heading: "",
                  body: "These values provide a snapshot of the current health of the queue, refresh the page to update"
                }}/>
                <table className={"govuk-table"}>
                  <tbody className={"govuk-table__body"}>
                  <tr className={"govuk-table__row"}>
                    <th scope="row" className={"govuk-table__header"}>Messages</th>
                    <td id="threeds-sim-order-code"
                        className={"govuk-table__cell"}>{queueStatus.attributes != undefined ? queueStatus.attributes.ApproximateNumberOfMessages : "unknown"}</td>
                  </tr>
                  <tr className={"govuk-table__row"}>
                    <th scope="row" className={"govuk-table__header"}>Messages not visible</th>
                    <td id="threeds-sim-pa-req"
                        className={"govuk-table__cell"}>{queueStatus.attributes != undefined ? queueStatus.attributes.ApproximateNumberOfMessagesNotVisible : "unknown"}</td>
                  </tr>
                  <tr className={"govuk-table__row"}>
                    <th scope="row" className={"govuk-table__header"}>Messages delayed</th>
                    <td id="threeds-sim-pa-req"
                        className={"govuk-table__cell"}>{queueStatus.attributes != undefined ? queueStatus.attributes.ApproximateNumberOfMessagesDelayed : "unknown"}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default QueueStatus
