import React, { MouseEventHandler, useState, useEffect } from 'react'
import ResultCards from './components/ResultCards'
import RouteCards from './components/RouteCards'
import AwaitingInput from './components/AwaitingInput'
// import { forEachChild } from 'typescript';

// add fx to preload (contextIsolation) to prevent end users from reaching electron API
declare global {
  interface Window {
    electronAPI: any;
  }
}

function App () {
  // dummy data to replace

  const dummypaths: string[] = ['fetch/request/1', 'fetch/request/2', 'fetch/request/3', 'fetch/request/4', 'fetch/request/5']
  const [dummyUpload, setDummyUpload]: any = useState('')

  // based on ERD
  const dummyRoutes: any = [
    { id: 'id1', detail: 'detailString1', input: 'inputSTR1', middleware: [{ detail: 'detailSTR1', input: 'inputSTR1' }], latest_test: 'foreignKey1' },
    { id: 'id2', detail: 'detailString2', input: 'inputSTR2', middleware: [{ detail: 'detailSTR2', input: 'inputSTR2' }], latest_test: 'foreignKey2' },
    { id: 'id3', detail: 'detailString3', input: 'inputSTR3', middleware: [{ detail: 'detailSTR3', input: 'inputSTR3' }], latest_test: 'foreignKey3' }
  ]

  const dummyTests: any = [
    { id: 'foreignKey1', route: 'id1', created_at: 'createdStr', request: { method: 'methodStr', endpoint: 'someEndstr' }, response: { status_code: 'statusStr', message: 'good', payload: { somePayLoad: 'PLString' } }, error: 'errorStr', rtt: 'rttString' },
    { id: 'foreignKey2', route: 'id1', created_at: 'createdStr', request: { method: 'methodStr', endpoint: 'someEndstr' }, response: { status_code: 'statusStr', message: 'good', payload: { somePayLoad: 'PLString' } }, error: 'errorStr', rtt: 'rttString' },
    { id: 'foreignKey3', route: 'id1', created_at: 'createdStr', request: { method: 'methodStr', endpoint: 'someEndstr' }, response: { status_code: 'statusStr', message: 'MessageStr', payload: { somePayLoad: 'PLString' } }, error: 'errorStr', rtt: 'rttString' }
  ]
  // end dummy data

  // const [routesFromButton, setRoutesFromButton] = useState<any>([])

  let directoryButton
  const getAllRoutes: any = []
  let getTests: any

  // useEffect(() => {

  // }, []);

  // working version before messing with it

  //   const [results, setResults] = useState<any>([])
  //  //Find the right mouse event instead of any!!!!!!
  //   const resultHandler = (event: any) => {
  //     event.preventDefault()
  //     let testToFilter = '';
  //     const filteredTests: string[] = [];
  //     testToFilter = event.target.id
  //     //push any test that are associated to the selected route based on id/route respectively
  //     for (const test of dummyTests) {
  //       if (test.route === testToFilter) {
  //         filteredTests.push(test)
  //       }
  //     }
  //     setResults(filteredTests);
  //   }
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

  let directory

  // const handleButtonClick = async () => {
  //   directory = await window.electronAPI.openFile(); //.then()? Maybe save this as temp and chain open file and parse file in one here;
  //   console.log('directory: ', directory);
  //   const temp = await window.electronAPI.parseFiles('directory');
  //   console.log(await temp);
  //   setResources(await temp);
  // };

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

        {/* can probably delete this block since the button takes care of this function */}
        {/* <input type="file" className="file-input file-input-bordered file-input-sm w-[10%] max-w-xs"
          onChange={(e) => {
            //We are missing some attributes here like value!!!!!:
            //I had difficulty trying to debug this section
            console.log(e.target.files?.[0].name)
            setDummyUpload(e.target.files?.[0].name)
            console.log(typeof dummyUpload)

          }} /> */}
        <button className="btn btn-sm" onClick={handleButtonClick}>Select A Directory</button>

        {/* <button className="btn btn-sm" onClick={fetchFromDB}>DB for Last Test ID</button> */}
        <input type="text" placeholder="PORT #: 9000" className="input input-sm input-bordered w-[10%] max-w-xs" />
      </div>
      <hr />
      <div id="main">
        <div id='routesSection'>
          <h2 className='title'>Routes</h2>
          {/* {fetchResources.map((routes: any) => (
            // message is referencing the first object in the tests array
            <RouteCards id={routes.id} detail={routes.detail} method={routes.input} message={dummyTests?.[0].response.message} onClick={resultHandler} key={routes.id} />
          ))} */}
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
