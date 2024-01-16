type NotificationProps = {
  type: string
  content: {
    title: string,
    heading: string,
    body: string
  }
}

const Notification = (props: NotificationProps) => {
  const {type, content} = props

  return (
    <div className={`govuk-notification-banner govuk-notification-banner--${type}`}
         role="alert"
         aria-labelledby="govuk-notification-banner-title"
         data-module="govuk-notification-banner">
      {content.title != "" ?
        <div className="govuk-notification-banner__header">
          <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
            {content.title}
          </h2>
        </div> : null
      }
      <div className="govuk-notification-banner__content">
        {content.heading != "" ?
          <h3 className="govuk-notification-banner__heading">
            {content.heading}
          </h3> : null
        }
        {content.body != "" ?
          <p className="govuk-body">
            {content.body}
          </p> : null
        }
      </div>
    </div>
  )
}

export default Notification
