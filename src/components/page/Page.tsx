    import React, {useState, useEffect} from 'react'
    import "./page.scss";
    import 'animate.css'
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
    import { faAngleLeft, faTrash} from '@fortawesome/free-solid-svg-icons'
    import { EditText, EditTextarea } from 'react-edit-text';
    import 'react-edit-text/dist/index.css';
    import GeolocationSegment from "./geolocation/GeolocationSegment"
    import DateSegment from './DateSegment'
    import PaperTest from "./PaperTest"


interface pageProps {
  page_name: string,
  page_content: string,
  page_perex: string,
  index: number,
  page_creation_timestamp: {nanoseconds: number, seconds: number},
  page_newly_added?: boolean,
  changePageValue: (pageName : string, pagePerex : string, pageContent : string, index :number) => void,
  editMode: boolean,
  deletePage: (index: number) => void
}

const Page = (props : pageProps) => {
  const [pageZoomed, setpageZoomed] = useState(false)
  const [pageName, setpageName] = useState(props.page_name)
  const [pagePerex, setpagePerex] = useState(props.page_perex)
  const [pageContent, setpageContent] = useState(props.page_content)

  useEffect(() => {
   if(props.page_newly_added){
    setpageZoomed(true)
   }
  }, [])


  useEffect(() => {
   props.changePageValue(pageName, pagePerex, pageContent,props.index)
  }, [pageName, pagePerex, pageContent])

  function convertSecondsToDate (seconds : number){
    const t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(seconds);
    return t;
  }

  function zoomPage (){
    setpageZoomed(!pageZoomed)
  }
  
const pageLarge  = <div onClick={zoomPage} className = " pageLargeBackground">

  <div className='pageLarge' onClick={(event) => event.stopPropagation()}>
  <div className=' parchment'></div>

    <div className='textContent'>
      <h1 className = "editableText" >
        {props.editMode ?
        <EditText onChange={(e) => {setpageName(e.target.value)}} value={pageName} />
        : pageName} 
       </h1>
      <h3 className = "editableText" >
        {props.editMode ? <EditText onChange={(e) => {setpagePerex(e.target.value)}} value={pagePerex} />
        : pagePerex
        }
        </h3>
      <div className = "editableText" >
        <div className='editableTextArea'>
          {props.editMode ? <EditTextarea rows={15} onChange={(e) => {setpageContent(e.target.value)}} value={pageContent} /> : pageContent}
        </div>
      </div>
      {/* uncomment after continuing to work on page */}
      {/* <GeolocationSegment></GeolocationSegment>
      <DateSegment></DateSegment> */}
      <p onClick={zoomPage} className='returnButton'><FontAwesomeIcon icon={faAngleLeft} /> return</p>
    </div>
  </div>
</div>

const pageBasic = <div onClick={zoomPage} className='col-xs-6 col-sm-5 col-md-4 col-lg-3 page'>
{props.editMode ? <FontAwesomeIcon className='trashIcon' onClick={() => {props.deletePage(props.index)}}  icon={faTrash} />  : <></>}

<div className=' parchment'></div>
<div className='textContent'>
<h2>{props.page_name}</h2>
<hr></hr>
<p>{props.page_perex}</p>
<p>on the {String(convertSecondsToDate(props.page_creation_timestamp.seconds))}</p>
</div>
</div>



  return (
    <>   
    { pageZoomed ? pageLarge : pageBasic}
    {/* <PaperTest></PaperTest> */}
    </>
  )
}

export default Page