<div class="center">
<h1 ><img src="src/static/logo.svg" width="25" height="25"> Middle-Aware</h1>
<h3>A call stack vizualization tool for Express developers!</h3>
</div>

<br>

[Middle-Aware](https://middle-aware.com) is developer tool that visualizes the request and response cycle, and the [middleware](https://expressjs.com/en/guide/using-middleware.html#using-middleware) of a full stack project that uses [Express](https://expressjs.com/). Middle-Aware will instrument source code, run the project, and trace requests through middleware chains. The tools allows developers to debug, troubleshoot, or understand their project. You can find more information on our [Medium article](https://medium.com/@marchantjustinw/introducing-middle-aware-a-call-stack-visualizer-for-express-developers-798073951d83).

<br>

## Installing
The latest stable version can be found [here](https://middle-aware.com/). 

## Requirements
Middle-Aware currently requires a local or remote MongoDB database. Please read through MongoDB instructions to acquire one and retrieve a URI.

## Getting Started
Once Middle-Aware is installed, create a JSON configuration file that will help Middle-Aware run. Every property in the table below is required. Please see an example of a configuration file below as well.

<br>

| Property              | Type                    | Description                                     |
| --------------------- | ------------------------| ----------------------------------------------- |
| MONGODB_URI           | String                  | This should be the URI to the MongoDB databse acquired as mentioned under the Requirements section. This can be a local or remote MongoDB instance.                                 |
| proxyPort | Integer | User-defined port that the Middle-Aware proxy server should run on. |
| backEndPort | Integer | This tells Middle-Aware which port your project's backend is using. This port should match the port your Express server will be listening on. |
| frontEndPort | Integer | This tells Middle-Aware which port your project's frontend is using. This port should match the port your frontend will be running on.  |
| targetDir | String | This must be an absolute path. This tells Middle-Aware where to run a copy of the your project (shadow directory). Middle-Aware does not create a directory at this path. So, you may want to target an empty directory like in the example above. |
| rootDir | String | This must be an absolute path. This tells Middle-Aware where your project is located and this must be the root level of the project. |
| backEnd | String | This must be an absolute path. This tells Middle-Aware where your project's backend is located. This must be the top most level of the backend to be instrumented by the tool. |
| frontEnd | String | This must be an absolute path. This tells Middle-Aware where your project's frontend is located and this must be the root level of the frontend. |
| startScript | String | Provide the scripts that will run your project, both frontend and backend. If Webpack Dev Server is configured in your project, we recommend providing the script that will start it. Additionally if using TypeScript, compiling will be required first. See examples below. |
| projectName | String | Provide the name of your project here. |

<br>

```
{
    "MONGODB_URI":"mongodb+srv://user:password@cluster.mongodb.net/",
    "proxyPort":9001, 
    "backEndPort":3000, 
    "frontEndPort":8080, 
    "targetDir": "/Users/exampleUser/Documents/exampleDirectory", 
    "rootDir":"/Users/exampleUser/Documents/exampleProject", 
    "backEnd":"/Users/exampleUser/Documents/exampleProject/backend", 
    "frontEnd":"/Users/exampleUser/Documents/exampleProject/frontend", 
    "startScript":"tsc && npm start", 
    "projectName":"Example Project Name"
}
```

<br>

If using Webpack Dev Server, refactor your proxy rules to forward all requests to the Middle-Aware proxy server.

```
devServer: {
    port: 8080,
    static: { directory: './dist' },
    watchFiles: {
      paths: ['./frontend/**/*'],
    },
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:[insert proxyPort value here]',
    },
  }
```

After the above have been completed...
1. Open Middle-Aware.
2. Once open, click on the "Config File" button to load your configuration file. 
3. Once loaded, click on the "Start" button. 
4. Once started, you can go to your frontend (localhost:frontEndPort) in your browser and interact with your project. 
5. After some interaction, click on "Fetch Tests" in Middle-Aware or use the toggle for automatic fetching, to get your instrumentation data. 
6. If you decide to make changes to your source code, repeat steps 3-6 as needed.

<br>

<details open> 
    <summary><b> The Team </b></summary> <a name="contacts"></a>

- [Felix Leclerc Jr.](https://github.com/Felixljr)
- [Jason Breen](https://github.com/jason-breen)
- [Justin Marchant](https://github.com/justinwmarchant)
- [Tim Chang](https://github.com/timchang87)
- [Zhiyi Huang](https://github.com/zhiyi15)

</details>

<br>

## Legal

<!-- ## Credits (Contributors) <a name = "credits"></a>
Give credits to the team here, we can make list if needed -->

<details open> 
    <summary><b> License </b></summary> <a name="license"></a>

MIT License

Copyright (c) 2023 OSLabs Beta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

</details>