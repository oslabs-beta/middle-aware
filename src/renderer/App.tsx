import React, { useState } from 'react';
import ResultCards from './components/ResultCards';
import RouteCards from './components/RouteCards';
import AwaitingInput from './components/AwaitingInput';

declare global {
  interface Window {
    electronAPI: any;
  }
}

function App() {

  // dummy data to replace
  const dummypaths: string[] = ['fetch/request/1', 'fetch/request/2', 'fetch/request/3', 'fetch/request/4', 'fetch/request/5'];
  const [dummyUpload, setDummyUpload]: any = useState('')


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
        <button className="btn btn-sm loading">Find All Paths</button>
        <input type="text" placeholder="PORT" className="input input-sm input-bordered w-[10%] max-w-xs" />
        <input type="file" className="file-input file-input-bordered file-input-sm w-[10%] max-w-xs"
          onChange={(e) => {
            //We are missing some attributes here like value!!!!!:
            //I had difficulty trying to debug this section
            console.log(e.target.files?.[0].name)
            setDummyUpload(e.target.files?.[0].name)
            console.log(typeof dummyUpload)

          }} />
      </div>
      <hr />
      <div id="main">
        <div id='routesSection'>
          <h2 className='title'>Routes</h2>
          <RouteCards />

        </div>
        <div id='resultsSection'>
          <h2 className='title'>Results</h2>
          <ResultCards />
          <AwaitingInput />
        </div>

      </div>
    </>
  );
}

export default App;
