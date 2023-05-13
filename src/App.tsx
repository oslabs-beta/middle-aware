import React, { useState } from 'react'
import ResultCards from './components/ResultCards'
import RouteCards from './components/RouteCards'
import { Responses, APIfuncs, fetchCall, MAConfig } from './Types'
import Header from './components/Header'
import Footer from './components/Footer'
import Notification from './components/Notification'
import { GrConfigure } from 'react-icons/gr'
import { IoDocumentTextOutline, IoAlertCircleSharp } from 'react-icons/io5'
import Loading from './components/Loading'
import { BiWindows } from 'react-icons/bi'

declare global {
  interface Window {
    electronAPI: APIfuncs
  }
}

function App () {
  // checks if a config file was selected already
  const [config, setConfig] = useState<boolean>(false)
  // control overlay
  const [loading, setLoading] = useState<boolean>(false)
  // This will store the lastest test retrieved from the fetchFromDB function below
  const [results, setResults] = useState<Responses[]>([])
  // allRoutes will store all routes from the dB, this is used to populate the Routes card in the GUI
  const [allRoutes, setAllRoutes] = useState<any>([])
  // this is used to store all the routes found by parseAPIRequest
  const [fetchResources, setResources] = useState<fetchCall[]>([])
  // Notifcation for new test
  const [showNewTest, setShowTests] = useState<boolean>(false)
  // Import app configuration to electron front end
  const [appConfig, setAppConfig] = useState<MAConfig|null>(null)

  // This will watch if there are any new tests and will trigger the notification

  // send start status from header to footer
  const [startStatus, setStartStatus] = useState<boolean>(false)
  const startStatusHandler = () => {
    setStartStatus(!startStatus)
  }

  // const [routeAndResultVisibility, setRouteAndResultVisibility] = useState(false)

  // fetchTestFromDB fetches the tests associated with the endpoint that is selected on the left hand side of the app; this is used to render the Result cards

  // const fetchTestsFromDB = (id: string) => {
  //   let getTests: Responses[]
  //   window.electronAPI
  //     .getTest(id)
  //     .then((data: string) => {
  //       getTests = JSON.parse(data)
  //       setResults(getTests)
  //     })
  //     .catch((err: unknown) => console.log('Problem with db Tests:', err))
  // }

  // Each route card on the left is a div, when clicked the divs render the result cards on the right; fetchTestsFromDB is invoked for the test data
  const resultHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const testToFilter = (event.target as HTMLDivElement).id // path name from parseAPIReq.js
    console.log('testToFilter: ', testToFilter)
    // this will stay as is. consider adding a popover or something to explain template literals!!!!!!
    const testsToRender = []
    for (const item of allRoutes) {
      if (item.last_test.request.route === testToFilter) {
        testsToRender.push(item)
      }
    }
    setResults(testsToRender)
  }

  // triggered by 'Look for test data' button (passed as prop to header)
  const fetchFromDB = () => {
    console.log('allRoutes: ', allRoutes) // this is set before during copyConfig()
    window.electronAPI
      .getAllRoutes()
      .then((data: string) => {
        // save all the routes to setAllRoutes
        setAllRoutes(JSON.parse(data))
      })
      .catch((err: unknown) => console.log('Problem with db Routes:', err))
  }

  // this is declare just to pass as a prop to header, might be an easier way to do this
  const startInstrumentation = () => {
    window.electronAPI
      .startInstrumentation()
  }

  // select a directory button to select a path
  // const handleButtonClick = () => {
  //   window.electronAPI
  //     .openFile('directory')
  //     .then((result: string) => {
  //       // Expect result to be a directory
  //       window.electronAPI
  //         .parseFiles(result)
  //         .then((result: fetchCall[]) => {
  //           // Expect result to be an array of fetch resources
  //           setResources(result) //    return result;
  //         })
  //         .catch((err: unknown) => console.log('parseFiles Error:', err))
  //     })
  //     .catch((err: unknown) => console.log('openFile Error: ', err))
  //   fetchFromDB()
  // }

  const openDocs = () => {
    window.electronAPI
      .documentation()
  }

  const copyConfig = () => {
    window.electronAPI
      .openFile('file')
      .then((fileSelected: string) => {
        setLoading(true)
        // Expect result to be a directory
        window.electronAPI
          .copyConfig(fileSelected)
        if (fileSelected) {
          setTimeout(() => {
            setConfig(true)
            setLoading(false)
          }, 2000)
        }
      }).catch((err: unknown) => console.log('copyConfig Error: ', err))
      .then(() => {
        window.electronAPI.readConfig().then((result) => setAppConfig(result))
      })
      .then(() => {
        window.electronAPI
          .startFEParseAndServer()
          .then((result: any) => {
            setResources(result.parsedAPI.body)
          }).catch((err: unknown) => console.log('parseFiles Error:', err))
      })
    fetchFromDB() // should we leave this here?????????? Thought we should at least get the test in advance
  }

  return (
    <>
      <Header config={copyConfig} configStatus={config} started={startStatusHandler} instrument={startInstrumentation} tests={fetchFromDB} />
      {showNewTest ? <Notification message={'Found New Test!'} /> : null}
      {config
        ? <div id='main'>
          <div id='cards-section'>
            <div id='route-cards'>
              <h2 className='title'>Routes</h2>
              {fetchResources.map((routes: fetchCall) => {
                console.log('routes: ', routes)
                // use this array to store the routes that have been tested
                const databaseRoutes: any = {}
                for (const routeData of allRoutes) {
                  databaseRoutes[routeData.last_test.request.route] = routeData.last_test.error
                }
                console.log('allRoutes :', allRoutes)
                const available = routes.route in databaseRoutes

                return (
                  <RouteCards id={routes.route} detail={routes.route} onClick={resultHandler} key={fetchResources.indexOf(routes)} available={available} error={databaseRoutes[routes.route]} method={routes.method} />
                )
              })}
            </div>
            <div id='result-cards'>
              <h2 className='title'>Results</h2>
              {!results[0]
                ? <>
                  {
                  <div id='noResults'>
                    <p id='noResultMsg'>
                      Please select a route to view results or exercise a route to generate results.
                    </p>
                  </div>

                  }
                </>
                : results.map((result: any) => (
                  <ResultCards id={result._id} key={results.indexOf(result)} request={result.last_test.request} response={result.last_test.response} rtt={result.last_test.response_time} middleware={result.last_test.middleware} />
                ))}
            </div>
          </div>
        </div>
        : loading
          ? <Loading />
          : <div id='overlay'>
            <div className='start'>
              <IoAlertCircleSharp id='start_point' />
              <div>
                <div className='start-message'>To get started please select
                  <button
                    type="button"
                    className="start-button"
                    onClick={copyConfig}
                  >
                    <div className='icons'>

                    </div>
                    <GrConfigure className='start_icon' />
                    <p>Config File</p>
                  </button> above.</div>
                <br />
                <div className='start-message'>
                  If you need assistance see our
                  <button
                    type="button"
                    className="start-button"
                    onClick={openDocs}
                  >
                    <div className='icons'>

                    </div>
                    <IoDocumentTextOutline className='start_icon' />
                    <p>Documentation</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
      }
      {appConfig
        ? <Footer projectName={appConfig.projectName} proxyPort={appConfig.proxyPort} frontEndPort={appConfig.frontEndPort} backEndPort={appConfig.backEndPort} started={startStatus} />
        : <div></div>
      }
    </>
  )
}

export default App
