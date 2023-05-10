import React, { useState } from 'react'
import ResultCards from './components/ResultCards'
import RouteCards from './components/RouteCards'
import { Responses, APIfuncs, fetchCall } from './Types'
import Header from './components/Header'
import Footer from './components/Footer'
import Notification from './components/Notification'
import { GrConfigure } from 'react-icons/gr'
import { IoDocumentTextOutline, IoAlertCircleSharp } from 'react-icons/io5'
import Loading from './components/Loading'

declare global {
  interface Window {
    electronAPI: APIfuncs
  }
}

function App() {
  //checks if a config file was selected already
  const [config, setConfig] = useState<boolean>(false)
  //control overlay
  const [loading, setLoading] = useState<boolean>(false)
  // This will store the lastest test retrieved from the fetchFromDB function below
  const [results, setResults] = useState<Responses[]>([])
  // allRoutes will store all routes from the dB, this is used to populate the Routes card in the GUI
  const [allRoutes, setAllRoutes] = useState<{ detail: string, last_test_id: string }[]>([])
  // this is used to store all the routes found by parseAPIRequest
  const [fetchResources, setResources] = useState<fetchCall[]>([])


  //send start status from header to footer
  const [startStatus, setStartStatus] = useState<boolean>(false)
  const startStatusHandler = () => {
    setStartStatus(!startStatus)
  }




  // const [routeAndResultVisibility, setRouteAndResultVisibility] = useState(false)

  // fetchTestFromDB fetches the tests associated with the endpoint that is selected on the left hand side of the app; this is used to render the Result cards
  const fetchTestsFromDB = (id: string) => {
    let getTests: Responses[]
    window.electronAPI
      .getTest(id)
      .then((data: string) => {
        getTests = JSON.parse(data)
        setResults(getTests)
      })
      .catch((err: unknown) => console.log('Problem with db Tests:', err))
  }
  // Each route card on the left is a div, when clicked the divs render the result cards on the right; fetchTestsFromDB is invoked for the test data
  const resultHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    let testToFilter = (event.target as HTMLDivElement).id // path name from parseAPIReq.js
    // this will stay as is. consider adding a popover or something to explain template literals!!!!!!
    for (const item of allRoutes) {
      // item.detail (e.g. /api/auth/user/)
      const temp = (item.detail.charAt(item.detail.length - 1) === '/' ? item.detail.slice(0, item.detail.length - 2) : item.detail)
      // if path from div === cleaned up temp
      if (testToFilter === temp) {
        testToFilter = item.last_test_id
      }
    }
    //console.log('testToFilter: ', testToFilter)
    fetchTestsFromDB(testToFilter)
  }

  // triggered by 'Look for test data' button
  const fetchFromDB = () => {
    window.electronAPI
      .getAllRoutes()
      .then((data: string) => {
        // save all the routes to setAllRoutes
        setAllRoutes(JSON.parse(data))
      })
      .catch((err: unknown) => console.log('Problem with db Routes:', err))
  }

  //this is declare just to pass as a prop to header, might be an easier way to do this
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
      .then(()=>{
        window.electronAPI
          .startFEParseAndServer()
          .then((result: any) => {
            setResources(result.parsedAPI.body)
          }).catch((err: unknown) => console.log('parseFiles Error:', err))
      })
  }

  return (
    <>
      <Header config={copyConfig} configStatus={config} started={startStatusHandler} instrument={startInstrumentation} />
      {config ?
        <div id='main'>
          <div id='cards-section'>
            <div className='card-columns'>
              <h2 className='title'>Routes</h2>
              {fetchResources.map((routes: fetchCall) => {
                 console.log('routes: ', routes)
                const databaseRoutes: string[] = []
                for (const routeData of allRoutes) {
                  databaseRoutes.push(routeData.detail)
                }
                // const available = databaseRoutes.includes(routes.route)
                // // change this to use and display the status codes on the GUI
                // const error = true
                return (
                  <RouteCards id={routes.route} detail={routes.route} onClick={resultHandler} key={fetchResources.indexOf(routes)} available={true} error={true} />
                )
              })}
            </div>
            <div className='card-columns'>
              <h2 className='title'>Results</h2>
              {!results[0]
                ? <>
                  { }
                </>
                : results.map((results: Responses) => (
                  <ResultCards id={results._id} key={results._id} request={results.request} response={results.response} rtt={results.rtt} route_id={results.route_id.ref} />
                ))}
            </div>
          </div>
        </div>
        :
        loading ?
          <Loading />
          :
          <div id='overlay'>
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
      <Footer started={startStatus} />
    </>
  )
}

export default App
