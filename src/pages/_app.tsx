import "../styles/stubs.scss"
import type {NextComponentType} from "next"
import Head from "next/head"
import Header from "../components/header";

type StubsProps = {
  Component: NextComponentType
  pageProps: object
}

const Stubs = (props: StubsProps) => {
  const {Component, pageProps} = props
  return (
    <div>
      <Head>
        <title>GOV.UK Pay Stubs</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      <Header serviceName={"Stubs"}/>
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  )
}

export default Stubs
