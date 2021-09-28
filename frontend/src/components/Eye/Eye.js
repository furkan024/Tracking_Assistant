import React, { useEffect, useState, useCallback } from 'react';


const Eye = () => {
    const [isStarted, setIsStarted] = useState(false)
  

    useEffect(() => {
        const gazeCloudApi = document.createElement('script');
        const gazeRecorderApi = document.createElement('script');
        const gazePlayer = document.createElement('script');

        gazeCloudApi.src = "https://app.gazerecorder.com/GazeCloudAPI.js";
        gazeCloudApi.async = true;

        gazeRecorderApi.src = "https://app.gazerecorder.com/GazeRecorderAPI.js";
        gazeRecorderApi.async = true;

        gazePlayer.src = "https://app.gazerecorder.com/GazePlayer.js";
        gazePlayer.async = true;

        document.body.appendChild(gazeCloudApi);
        document.body.appendChild(gazeRecorderApi);
        document.body.appendChild(gazePlayer);

        const handleEsc = (event) => {
            if (event.keyCode === 27) {
             console.log('Close')
             PlayRec();
           }
         };
         window.addEventListener('keydown', handleEsc);

        




        console.log(gazeCloudApi);
        console.log(gazeRecorderApi);
        console.log(gazePlayer);

        return () => {
            document.body.removeChild(gazeCloudApi);
            document.body.removeChild(gazeRecorderApi);
            document.body.removeChild(gazePlayer);

            window.removeEventListener('keydown', handleEsc);
        }
    }, []);

    const Navigate = () => {
        var url = document.getElementById("url").value;
        console.log(url)
        window.GazeRecorderAPI.Navigate(url);
    };

    const PlayRec = () => {
        setIsStarted(false);
        EndRec();
        window.GazePlayer.SetCountainer(document.getElementById("playerdiv"));

        var SesionReplayData = window.GazeRecorderAPI.GetRecData();
        console.log('SesionReplayData', SesionReplayData);
        window.GazePlayer.PlayResultsData(SesionReplayData);
    };

    const Start = () => {
            setIsStarted(true);
            
            var url = document.getElementById("urlstart").value;
            window.GazeCloudAPI.StartEyeTracking();
            window.GazeCloudAPI.OnCalibrationComplete = function () {
                window.GazeRecorderAPI.Rec(url);
            };

            
     };

    const EndRec = () => {
        
        window.GazeRecorderAPI.StopRec();
        //console.log('results', window.GazeCloudAPI.OnResult((GazeData) => { GazeData.state, GazeData.time }));
        window.GazeCloudAPI.StopEyeTracking();
        // 0: valid gaze data; -1 : face tracking lost, 1 : gaze data uncalibrated GazeData.docX 
        // gaze x in document coordinates GazeData.docY // gaze y in document coordinates GazeData.time // timestamp }

    }

    console.log('isStarted', isStarted);
    return (
        <div>
        {isStarted ? (
            <div id="navi">
                Url:
                <input type="text" id="url" name="name" required size="50"  value="https://discord.com/"/>
                <button onClick={Navigate} type="button">Go</button>
                <button onClick={PlayRec} type="button">Finish Reording, Play results</button>
            </div>
        ): null}
            


            <h1 align='center'>GazeRecorderAPI integration example</h1>


            <div align="center">
                <p align='center'> URL</p>
                <input 
                    type="text" id="urlstart" 
                    name="name" required size="50" 
                    value="https://discord.com/"
                    />


                <button onClick={Start} type="button">start</button>
            </div>

            <div id="playerdiv"
            align="center"
            
            >
            </div>
        </div>
    );
}

export default Eye;