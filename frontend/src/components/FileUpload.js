import React, { useState } from 'react'
import { push } from 'react-router-redux';
import { Field } from 'react-final-form';


// Import React FilePond
import { FilePond, File, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginMediaPreview from 'filepond-plugin-media-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.css";


// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginMediaPreview)

// Our app
const FileUpload = (record) => {
  const [file, setFile] = useState([])
  const process = () => {
    setTimeout(function () { window.location.replace("http://localhost:3000/#/medias") }, 1000);
  }
  const userId = JSON.parse(localStorage.getItem('auth')).userId;
  return (
    <span>
     
      <FilePond
        files={file}
        onupdatefiles={setFile}
        allowMultiple={false}
        server={`http://localhost:4000/api/medias/${userId}`}
        name="file" 
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        onprocessfile={process}
      />
      
      </span>
      
  )
}

export default FileUpload;