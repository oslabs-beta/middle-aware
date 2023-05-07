import React, { useState } from 'react'
import ResultCards from './components/ResultCards'
import RouteCards from './components/RouteCards'
import { Responses, APIfuncs, fetchCall } from './Types'
import Header from './components/Header'
import Footer from './components/Footer'
import config_pic from './static/config_pic.png'
import Notification from './components/Notification'
import { IoDocumentTextOutline } from 'react-icons/io5'

declare global {
  interface Window {
    electronAPI: APIfuncs
  }
}

function App() {
  //checks if a config file was selected already
  const [config, setConfig] = useState<boolean>(false)
  //control overlay
  const [overlay, setOverlay] = useState<boolean>(true)
  // This will store the lastest test retrieved from the fetchFromDB function below
  const [results, setResults] = useState<Responses[]>([])
  // allRoutes will store all routes from the dB, this is used to populate the Routes card in the GUI
  const [allRoutes, setAllRoutes] = useState<{ detail: string, last_test_id: string }[]>([])
  // this is used to store all the routes found by parseAPIRequest
  const [fetchResources, setResources] = useState<fetchCall[]>([])

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
    console.log('testToFilter: ', testToFilter)
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

  // select a directory button to select a path
  const handleButtonClick = () => {
    window.electronAPI
      .openFile('directory')
      .then((result: string) => {
        // Expect result to be a directory
        window.electronAPI
          .parseFiles(result)
          .then((result: fetchCall[]) => {
            // Expect result to be an array of fetch resources
            setResources(result) //    return result;
          })
          .catch((err: unknown) => console.log('parseFiles Error:', err))
      })
      .catch((err: unknown) => console.log('openFile Error: ', err))
    fetchFromDB()
  }

  const openDocs = () => {
    window.electronAPI
      .documentation()
  }

  const copyConfig = () => {
    window.electronAPI
      .openFile('file')
      .then((fileSelected: string) => {
        // Expect result to be a directory
        window.electronAPI
          .copyConfig(fileSelected)
      }).catch((err: unknown) => console.log('copyConfig Error: ', err))
  }


  return (
    <>
      <Header config={copyConfig} />
      {config ?
        <div id='main'>
          <div id='cards-section'>
            <div className='card-columns'>
              <h2 className='title'>Routes</h2>
              <RouteCards id={'routes.route'} detail={'routes.route'} onClick={resultHandler} key={1} available={true} error={true} />
              <RouteCards id={'routes.route'} detail={'routes.route'} onClick={resultHandler} key={2} available={true} error={true} />
              {fetchResources.map((routes: fetchCall) => {
                const databaseRoutes: string[] = []
                for (const routeData of allRoutes) {
                  databaseRoutes.push(routeData.detail)
                }
                const available = databaseRoutes.includes(routes.route)
                // change this to use and display the status codes on the GUI
                const error = true
                return (
                  <RouteCards id={routes.route} detail={routes.route} onClick={resultHandler} key={fetchResources.indexOf(routes)} available={true} error={true} />
                )
              })}
            </div>
            <div className='card-columns'>
              <h2 className='title'>Results</h2>
              <RouteCards id={'routes.route'} detail={'routes.route'} onClick={resultHandler} key={1} available={true} error={true} />
              <RouteCards id={'routes.route'} detail={'routes.route'} onClick={resultHandler} key={2} available={true} error={true} />
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
        <div id='overlay'>
          <div className='start'>
            <div>
              <div className='start-message'>To get started please select
                <img src={config_pic} alt="Picture of config button" width={100} id='config_pic' /> above.</div>
                <br/>
              <div className='start-message'>
                If you need assistance see our
                <button
                  type="button"
                  className="button"
                  id='docBtn'
                  onClick={openDocs}
                >
                  <div className='icons'>

                  </div>
                  <IoDocumentTextOutline id='paper' />
                 <p>Documentation</p> 
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      <Notification/>
      <Footer />
    </>
  )
}

export default App
