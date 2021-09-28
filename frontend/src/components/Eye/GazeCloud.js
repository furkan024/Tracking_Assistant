import React, { useEffect, useState, useCallback } from 'react';
import './GazeCloud.css';


const GazeCloud = () => {
    const [isStarted, setIsStarted] = useState(false)


    useEffect(() => {
        const gazeCloudApi = document.createElement('script');
        gazeCloudApi.src = "https://app.gazerecorder.com/GazeCloudAPI.js";
        gazeCloudApi.async = true;
        document.body.appendChild(gazeCloudApi);

        const HeatMap = document.createElement('script');
        HeatMap.src = "https://api.gazerecorder.com/heatmapLive.js";
        HeatMap.async = true;
        document.body.appendChild(HeatMap);

        return () => {
            document.body.removeChild(gazeCloudApi);
            document.body.removeChild(HeatMap);
        }
    }, []);



    function PlotGaze(GazeData) {
        
        document.getElementById("GazeData").innerHTML = "GazeX: " + GazeData.GazeX + " GazeY: " + GazeData.GazeY;
        document.getElementById("HeadPhoseData").innerHTML = " HeadX: " + GazeData.HeadX + " HeadY: " + GazeData.HeadY + " HeadZ: " + GazeData.HeadZ;
        document.getElementById("HeadRotData").innerHTML = " Yaw: " + GazeData.HeadYaw + " Pitch: " + GazeData.HeadPitch + " Roll: " + GazeData.HeadRoll;
        
        if (document.getElementById("ShowHeatMapId").checked) // gaze plot
        {
            var x = GazeData.docX;
            var y = GazeData.docY;
            
            var gaze = document.getElementById("gaze");
            x -= gaze.clientWidth / 2;
            y -= gaze.clientHeight / 2;



            gaze.style.left = x + "px";
            gaze.style.top = y + "px";

            console.log('GazeData.state', GazeData.state)
            console.log('gaze.style', gaze.style.display)
            if (GazeData.state != 0) {
                if (gaze.style.display == 'block')
                    gaze.style.display = 'none';
            }
            else {
                if (gaze.style.display == 'none')
                    gaze.style.display = 'block';
            }

        }
    }

    window.addEventListener("load", function () {

        window.GazeCloudAPI.OnCalibrationComplete = function () { window.ShowHeatMap(true); console.log('gaze Calibration Complete') }
        window.GazeCloudAPI.OnCamDenied = function () { console.log('camera  access denied') }
        window.GazeCloudAPI.OnError = function (msg) { console.log('err: ' + msg) }
        window.GazeCloudAPI.UseClickRecalibration = true;
        window.GazeCloudAPI.OnResult = PlotGaze;
     });



    const Start = () => {
        console.log('start')
        window.GazeCloudAPI.StartEyeTracking()
        
        document.getElementById("startid").style.display = 'none';
        document.getElementById("stopid").style.display = 'block';
        window.GazeCloudAPI.StartEyeTracking();
        window.ShowHeatMap(true);
        
    }

    const Stop = () => {
        document.getElementById("startid").style.display = 'block';
        document.getElementById("stopid").style.display = 'none';
        window.GazeCloudAPI.StopEyeTracking();
        window.ShowHeatMap(false);
    }


    /*
    const handleClickHeatMap = (cb) => {
        let ck = document.getElementById("ShowHeatMapId").checked
        console.log('ck', ck)
        window.ShowHeatMap(true);
        //var heatContainer = document.getElementById("heatmapContainerWrapper");
        //heatContainer.style.display = 'block';
    }
    */


    console.log('isStarted', isStarted);
    return (
        <div style={{ overflow: 'hidden', textAlign: 'center' }}>
            <h1>Eye Tracker</h1>
            <button id='startid' type="button" className='buttonStartEyeTrack' onClick={Start}>Start</button>
            <button id='stopid' type="button" className='buttonStartEyeTrack' style={{display: 'none', textAlign: 'center'}} onClick={Stop}>Stop</button>
            <div >
                <p >
                    Real-Time Result:
                    <p id="GazeData" > </p>
                    <p id="HeadPhoseData" > </p>
                    <p id="HeadRotData" > </p>
                </p>
            </div>

            <div id="gaze"
                style={{
                    position: 'absolute', display: 'none',
                    width: '100px', height: '100px', borderRadius: '50%',
                    border: 'solid 2px rgba(255, 255, 255, .2)',
                    boxShadow: '0 0 100px 3px rgba(125, 125, 125, .5)',
                    pointerEvents: 'none',
                    zIndex: '999999'
                }}>
            </div>
            {/*
            
            <label htmlFor="ShowHeatMapId" >
                Show heatmap
            <input id="ShowHeatMapId" type="checkbox" defaultChecked={true} onClick={() => handleClickHeatMap(this)} />


            </label>
            */}
            
        </div>
    );
}

export default GazeCloud;