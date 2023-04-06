import Link from 'next/link'

const Home = () => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-m">Links</h1>

        <table className={"govuk-table"}>
          <tbody className={"govuk-table__body"}>
          <tr className={"govuk-table__row"}>
            <td className={"govuk-table__cell"}><Link className={"govuk-link"} href="/api/health">GET api/health</Link></td>
          </tr>
          <tr className={"govuk-table__row"}>
            <td className={"govuk-table__cell"}><Link className={"govuk-link"} href="/3ds-simulator">3D Secure Simulator
            </Link></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home
