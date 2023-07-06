import {useEffect, useState} from "react"

const QueueStatus = () => {

  const [queueStatus, setQueueStatus] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/queue/status');
      const json = await data.json();
      setQueueStatus(json);
    }

    fetchData()
      .catch(console.error)
  }, [])

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h1 className="govuk-heading-m">Queue Status</h1>
        <pre>{JSON.stringify(queueStatus, null, 2)}</pre>
      </div>
    </div>
  )
}

export default QueueStatus
