type ErrorProps = {
  summary: string,
  errors: string[]
}

const ErrorSummary = (props: ErrorProps) => {
  const {summary, errors} = props

  return (
    <div className="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <h2 className="govuk-error-summary__title">
          {summary}
        </h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {errors.map(function(errorMessage, i){
              return (
                <li key={i}>
                  <p className="govuk-body error-message">{errorMessage}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ErrorSummary
