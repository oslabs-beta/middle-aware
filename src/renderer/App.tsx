import React, { useState } from 'react';
import { Navbar, Button, Dropdown, Indicator, Badge, FileInput } from 'react-daisyui';
import LargeCards from './components/LargeCards';
import SmallCards from './components/SmallCards';

declare global {
  interface Window {
    electronAPI: any;
  }
}

function App() {

  // dummy data to replace
  const dummypaths: string[] = ['fetch/request/1', 'fetch/request/2', 'fetch/request/3', 'fetch/request/4', 'fetch/request/5'];


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

  // Arguments for DaisyUI Components
  const fileArgs: {} = {}


  // END OF Arguments for DaisyUI Components

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
        <button></button>
        <button></button>
        <FileInput {...fileArgs} className='xs' />
      </div>

      <hr />

      <div id="section">


      </div>
    </>
  );
}

export default App;
