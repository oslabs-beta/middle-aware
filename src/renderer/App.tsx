import React, { useState, useEffect } from 'react'
import ResultCards from './components/ResultCards'
import RouteCards from './components/RouteCards'
import AwaitingInput from './components/AwaitingInput'

// add fx to preload (contextIsolation) to prevent end users from reaching electron API
declare global {
  interface Window {
    electronAPI: any;
  }
}

function App () {
  let getTests: any

  const [results, setResults] = useState<any>([])
  const [allRoutes, setAllRoutes] = useState<any>([])

  const fetchTestsFromDB = (id: string) => {
    console.log('test id passed in app:', id)
    window.electronAPI
      .getTest(id)
      .then((data: any) => {
        // console.log(data)
        getTests = JSON.parse(data)
        console.log(getTests)
        setResults(getTests)
      })
      .catch((err: any) => console.log('Problem with db Tests:', err))
  }

  // Find the right mouse event instead of any!!!!!!
  const resultHandler = (event: any) => {
    event.preventDefault()
    let testToFilter = ''
    // let filteredTests: string[] = [];
    testToFilter = event.target.id // path name

    for (const item of allRoutes) {
      // item.detail (e.g. /api/auth/user/)
      const temp = (item.detail.charAt(item.detail.length - 1) === '/' ? item.detail.slice(0, item.detail.length - 2) : item.detail)
      if (testToFilter === temp) {
        testToFilter = item.last_test_id
      }
    }
    console.log('testToFilter: ', testToFilter)
    // tried hard coding:
    fetchTestsFromDB(testToFilter)
    // for (const test of getTests) {
    //   if (test.detail === testToFilter) {
    //     filteredTests.push(test)
    //   }
  }

  const [fetchResources, setResources] = useState([])

  const handleButtonClick = () => {
    window.electronAPI
      .openFile()
      .then((result: string) => {
        // const temp = window.electronAPI.openFile().then((result) => {
        // Expect result to be a directory
        window.electronAPI
          .parseFiles(result)
          .then((result: any) => {
            // Expect result to be an array of fetch resources
            console.log('handlebuttonclick/fetchFromResources', result)
            setResources(result) //    return result;
          })
          .catch((err: any) => console.log('parseFiles Error:', err))
      })
      .catch((err: any) => console.log('openFile Error: ', err)) // .then()? Maybe save this as temp and chain open file and parse file in one here;
  }

  const fetchFromDB = () => {
    window.electronAPI
      .getAllRoutes()
      .then((data: any) => {
        setAllRoutes(JSON.parse(data))
        // console.log('fetchfromDB: getallRoutes', getAllRoutes)
      })
      .catch((err: any) => console.log('Problem with db Routes:', err))
  }

  useEffect(() => {
    // Console log routes for debugging
    console.log('routes: ', allRoutes)
  })

  // this is for the key in the routes being rendered
  let index = 0

  return (
    <>
      <header>
        <h1>Middle-Aware</h1>
      </header>
      <hr />
      <div id='interface'>

        <button className="btn btn-sm" onClick={handleButtonClick}>Select A Directory</button>

        <input type="text" placeholder="PORT #: 9000" className="input input-sm input-bordered w-[10%] max-w-xs" />
      </div>
      <hr />
      <div id="main">
        <div id='routesSection'>
          <h2 className='title'>Routes</h2>

          {fetchResources.map((routes: any) => {
            const databaseRoutes = []
            for (const routeData of allRoutes) {
              databaseRoutes.push(routeData.detail)
            }
            const available = databaseRoutes.includes(routes)
            const error = (routes === '/api/cards')
            return (
              // key is using index above because there is no id; try to use the element index
              <RouteCards id={routes} detail={routes} onClick={resultHandler} key={index++} available={available} error={error}/>
            )
          })}

        </div>
        <div id='resultsSection'>
          <h2 className='title'>Results</h2>
            {!results[0]
              ? <>
              <AwaitingInput/>
              <div id='checkForData'>
              <button className="btn btn-sm" onClick={fetchFromDB}>Look For Test Data</button>
              </div>
              </>
              : results.map((results: any) => (
            <ResultCards id={results._id} key={results._id} request={results.request} response={results.response} rtt={results.rtt} route_id={results.route_id}/>
              ))}

        </div>

      </div>
    </>
  )
}

export default App
