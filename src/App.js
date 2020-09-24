import React,{useState} from 'react';
import './App.css';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [formData,setFormData] =  useState({selectedFile: null,loaded:0})

  const onChangeHandler=(event)=>{
    const files = event.target.files;
     if(maxSelectFile(event) && checkMimeType(event)  && checkFileSize(event)){ 
         setFormData({
          selectedFile: files,
          loaded:0
        });
    }
  }

  const onClickHandler = (e) => {
    const data = new FormData();
    if(formData.selectedFile===null){
      toast.error('File Empty');
      return true;
    }
    for(var x = 0; x<formData.selectedFile.length; x++) {
       data.append('file', formData.selectedFile[x])
    }
    axios.post("http://localhost:4000/upload", data, { 
        onUploadProgress: ProgressEvent => {
            setFormData({
              loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
            });
          }
    })
    .then(res => { 
    toast.success('upload success')
    })
    .catch(err => { 
        toast.error('upload fail')
    })
  }

  const maxSelectFile=(event)=>{
   let files = event.target.files // create file object
       if (files.length > 3) { 
          const msg = 'Only 3 images can be uploaded at a time'
          event.target.value = null // discard selected file
          console.log(msg)
         return false;

     }
   return true;
  }

  const checkMimeType=(event)=>{
    //getting file object
    let files = event.target.files;
    let err = []; // create empty array
    const types = ['image/png', 'image/jpeg', 'image/gif'];
    for(var x = 0; x<files.length; x++) {
       let fileTypeFound = false;
        for(const type of types){
          if(files[x].type === type){
            fileTypeFound = true;
            break;
          }
        }
        if(!fileTypeFound){
            err[x] = files[x].type+' is not a supported format\n';
        }
    };
    for(let z = 0; z<err.length; z++) { // loop create toast massage
        event.target.value = null; 
        toast.error(err[z]);
    }
     return true;
  }

  const checkFileSize=(event)=>{
    let files = event.target.files;
    let size = 512000;
    let err = ""; 
    for(let x = 0; x<files.length; x++) {
     if (files[x].size > size) {
        //err += files[x].type+'is too large, please pick a smaller file\n';
        toast.error(files[x].type+' is too large, please pick a smaller file\n');
        return false;
      }
    };
    if (err !== '') {
       event.target.value = null
       return false
    }
    return true;
  }


  return (
   <div className="container">
      <div className="row">
         <div className="col-md-6">
            <form method="post" action="#" id="#">
                  <div className="form-group files color">
                    <label>Upload Your File </label>
                    <input type="file" name="file" multiple  onChange={e=>onChangeHandler(e)}/>
                  </div>
                  <div className="form-group">
                    <Progress max="100" color="success" value={formData.loaded} >{Math.round(formData.loaded,2) }%</Progress>
                  </div>
                  <button type="button" className="btn btn-success btn-block" onClick={e=>onClickHandler(e)}>Upload</button>
                  <div className="form-group">
                     <ToastContainer />
                  </div>

              </form>
        </div>
      </div>
    </div>
  );
}

export default App;
