type ThreeDSProps = {
  orderCode: string | undefined,
  paReq: string,
  termUrl: string,
  paRes: string,
  md: string
}
const ThreeDSecureSimulator = (props: ThreeDSProps) => {
  const {orderCode, paReq, termUrl, paRes, md} = props
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <div style={{overflowX: "scroll"}}>
          <h1 id="threeds-sim-title" className="govuk-heading-l">3D Secure Simulator</h1>

          <p className={"govuk-body"}>Worldpay Cardholder Test Issuer received 3D Secure request for:</p>

          <table className={"govuk-table"}>
            <thead className={"govuk-table__head"}>
            <tr className={"govuk-table__row"}>
              <th scope="col" className={"govuk-table__header"}>Name</th>
              <th scope="col" className={"govuk-table__header"}>Value</th>
            </tr>
            </thead>
            <tbody className={"govuk-table__body"}>
            <tr className={"govuk-table__row"}>
              <th scope="row" className={"govuk-table__header"}>Order Code</th>
              <td id="threeds-sim-order-code" className={"govuk-table__cell"}>{orderCode}</td>
            </tr>
            <tr className={"govuk-table__row"}>
              <th scope="row" className={"govuk-table__header"}>PaReq</th>
              <td id="threeds-sim-pa-req" className={"govuk-table__cell"}>{paReq}</td>
            </tr>
            </tbody>
          </table>

          <h2 className={"govuk-heading-m"}>Please submit your Cardholder Authenticated Response</h2>

          <p id="threeds-sim-term-url" className={"govuk-body"}>This will submit the following form data
            to: <code>{termUrl}</code></p>

          <table className={"govuk-table"}>
            <thead className={"govuk-table__head"}>
            <tr className={"govuk-table__row"}>
              <th scope="col" className={"govuk-table__header"}>Name</th>
              <th scope="col" className={"govuk-table__header"}>Value</th>
            </tr>
            </thead>
            <tbody className={"govuk-table__body"}>
            <tr className={"govuk-table__row"}>
              <th scope="row" className={"govuk-table__header"}>PaRes</th>
              <td id="threeds-sim-pa-res" className={"govuk-table__cell"}>{paRes}</td>
            </tr>
            <tr className={"govuk-table__row"}>
              <th scope="row" className={"govuk-table__header"}>MD</th>
              <td id="threeds-sim-md" className={"govuk-table__cell"}>{md}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <br />
        <form id="threeds-sim-form" name="form_name" method="post" action={termUrl}>
          <input id="threeds-sim-form-pa-res" type="hidden" name="PaRes"
                 value={paRes}/>
          <input id="threeds-sim-form-md" type="hidden" name="MD" value={md}/>
          <input className={"govuk-button"} data-module="govuk-button" id="threeds-sim-form-submit" type="submit"
                 value="Submit"/>
        </form>
      </div>
    </div>
  )
}

export default ThreeDSecureSimulator

export type {
  ThreeDSProps
}
