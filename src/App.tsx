import React, { useState } from 'react'
import ResultCards from './components/ResultCards'
import RouteCards from './components/RouteCards'
import { Responses, APIfuncs, fetchCall } from './Types'
import Header from './components/Header'

declare global {
  interface Window {
    electronAPI: APIfuncs;
  }
}

function App () {
  // This will store the lastest test retrieved from the fetchFromDB function below
  const [results, setResults] = useState<Responses[]>([])
  // allRoutes will store all routes from the dB, this is used to populate the Routes card in the GUI
  const [allRoutes, setAllRoutes] = useState<{detail: string, last_test_id: string}[]>([])
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
      .openFile()
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

  // const routeAndResultDisplayHandler = () => {
  //   setRouteAndResultVisibility((priorState) => {
  //   !priorState
  // })
  // }

  return (
    <>
    <Header />
      <hr />
      <div id='interface'>
        <button className="btn btn-sm" onClick={handleButtonClick}>Select A Directory</button>
        <div className='reFetch'>
           <button className="btn btn-sm" onClick={fetchFromDB}>Fetch Tests</button>
        </div>
      </div>
      <hr />
      <div id="main">

        {/* <div id="routesAndResults"> */}
        {/* {!routeAndResultVisibility ?
          <button onClick={routeAndResultDisplayHandler}>Show Routes and Results</button>
         : */}
        <div id='routesSection'>
          <h2 className='title'>Routes</h2>
          {/* iterate through routes */}
          {fetchResources.map((routes: fetchCall) => {
            const databaseRoutes: string[] = []
            for (const routeData of allRoutes) {
              databaseRoutes.push(routeData.detail)
            }
            const available = databaseRoutes.includes(routes.route)
            // change this to use and display the status codes on the GUI
            const error = true
            return (
              <RouteCards id={routes.route} detail={routes.route} onClick={resultHandler} key={fetchResources.indexOf(routes)} available={available} error={error}/>
            )
          })}

        </div>
        <div id='resultsSection'>
          <h2 className='title'>Results</h2>

            {!results[0]
              ? <>
              {/* <div id='checkForData'>
              <button className="btn btn-sm" onClick={fetchFromDB}>Look For Test Data</button>
              </div> */}
              </>
              : results.map((results: Responses) => (
            <ResultCards id={results._id} key={results._id} request={results.request} response={results.response} rtt={results.rtt} route_id={results.route_id.ref}/>
              ))}

        </div>
        {/* } */}
        {/* </div> */}

      </div>
    </>
  )
}

export default App
