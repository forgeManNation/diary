    import React, {useState} from 'react'
    import "./page.scss";
    import 'animate.css'
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
    import { faAngleLeft} from '@fortawesome/free-solid-svg-icons'

    interface page {
    title: string;
    perex: string;
    date: Date;
    content: string;
}







const Page = () => {
  const [pageZoomed, setpageZoomed] = useState(false)

  function zoomPage (){
    setpageZoomed(!pageZoomed)
  }

  
const pageLarge  = <div onClick={zoomPage} className = " pageLargeBackground">
  <div className='pageLarge' onClick={(event) => event.stopPropagation()}>
    <div className='textContent'>
      <h1>Page</h1>
      <h3>Perex</h3>
      <p>content</p>
      <p onClick={zoomPage} className='returnButton'><FontAwesomeIcon icon={faAngleLeft} /> return</p>
    </div>
  </div>
</div>

const pageBasic = <div onClick={zoomPage} className='col-xs-6 col-sm-4 col-md-3 col-lg-2 page'>
<div className='textContent'>
<h2>This is a page</h2>
<hr></hr>
<p>Great adventutes with my mates</p>
<p>on the 25. December  2022</p>
</div>
</div>



  return (
    <>
    { pageZoomed ? pageLarge : pageBasic}
    </>
  )
}

export default Page