import React, { useState } from 'react';
import ResultCards from './components/ResultCards';
import RouteCards from './components/RouteCards';
import AwaitingInput from './components/AwaitingInput';
import { forEachChild } from 'typescript';

declare global {
  interface Window {
    electronAPI: any;
  }
}

function App() {

  // dummy data to replace

  const dummypaths: string[] = ['fetch/request/1', 'fetch/request/2', 'fetch/request/3', 'fetch/request/4', 'fetch/request/5'];
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

  let testToFilter = '';

  let filteredTests: any[]= [];

  const [results, setResults] = useState<any>([])

  //Find the right mouse event instead of any!!!!!!
  const resultHandler = (event: any) => {
    event.preventDefault()
    testToFilter = event.target.id
    console.log('testToFilter:', testToFilter);
    //push any test that are associated to the selected route based on id/route respectively
    for(const test of dummyTests){
      if(test.route === testToFilter){
        filteredTests.push(test)
      }
    }
    console.log('filteredTests',filteredTests);
    setResults(filteredTests);
    testToFilter = ''
    filteredTests = []
  }


  //end dummy data

  const [fetchResources, setResources] = useState([]);

  let directory;

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
        //const temp = window.electronAPI.openFile().then((result) => {
        // Expect result to be a directory
        window.electronAPI
          .parseFiles('../../../scratch/client', '2', '3', '4')
          .then((result: any) => {
            // Expect result to be an array of fetch resources
            setResources(result); //    return result;
          })
          .catch((err: any) => console.log('parseFiles Error:', err));
      })
      .catch((err: any) => console.log('openFile Error: ', err)); //.then()? Maybe save this as temp and chain open file and parse file in one here;
  };

  return (
    <>
      <header>
        <h1>Middle-Aware</h1>
      </header>
      <hr />
      <div id='interface'>
        {/* turn loading on within the button when parsing paths */}
        <input type="file" className="file-input file-input-bordered file-input-sm w-[10%] max-w-xs"
          onChange={(e) => {
            //We are missing some attributes here like value!!!!!:
            //I had difficulty trying to debug this section
            console.log(e.target.files?.[0].name)
            setDummyUpload(e.target.files?.[0].name)
            console.log(typeof dummyUpload)

          }} />
        <button className="btn btn-sm">Find All Paths</button>
        <input type="text" placeholder="PORT #" className="input input-sm input-bordered w-[10%] max-w-xs" />
      </div>
      <hr />
      <div id="main">
        <div id='routesSection'>
          <h2 className='title'>Routes</h2>
          {dummyRoutes.map((routes: any) => (
            // message is referencing the first object in the tests array
            <RouteCards id={routes.id} detail={routes.detail} method={routes.input} message={dummyTests?.[0].response.message} onClick={resultHandler} key={routes.id} />
          ))}

        </div>
        <div id='resultsSection'>
          <h2 className='title'>Results</h2>
            {!results[0] ? <AwaitingInput/>:

          results.map((results: any) => (
            <ResultCards id={results.id} message={results.response.message} payload={results.response?.payload} status={results.response.status} key={results.id}/>
          ))}

        </div>

      </div>
    </>
  );
}

export default App
