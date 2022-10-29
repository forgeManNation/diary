import React from "react"
import {Tooltip} from "reactstrap"
import {faFilePen, faFloppyDisk, faBookReader, faChevronLeft, faChevronRight, faCancel, faPen, faTrash, faMap} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import "./userControls.scss"


interface Props {
  editMode: boolean,
  save: () => void,
  deletePage: () => void,
  createNewPage: () => void,
  activePageIndex: number,
  diaryPagesLength: number,
  changePage: (numToChangeIndex: number) => void
}

const UserControls = ({editMode, save, deletePage, activePageIndex, diaryPagesLength, changePage, createNewPage}: Props) => {

  const [editTooltipOpen, seteditTooltipOpen] = React.useState(false)
  const editIconRef = React.useRef(null)
  const [saveTooltipOpen, setsaveTooltipOpen] = React.useState(false)
  const saveIconRef = React.useRef(null)
  const [disabledChevronTooltipOpen, setdisabledChevronTooltipOpen] = React.useState(false)
  const [disabledChevronRightTooltipOpen, setdisabledChevronRightTooltipOpen] = React.useState(false)
  const navigate = useNavigate();
  const disabledChevronRightRef = React.useRef(null)

  function changeEditModeOn() {
    if(editMode){
    navigate('/');
    }
    else{
    navigate('/edit')
    }
  }

  
  return (
    <div className="userControls">


    <div className='userControlsRow'>

    {activePageIndex !== 0 
    ? 
    <FontAwesomeIcon role="button" onClick={() => {changePage(-1)}} size = "lg"  icon={faChevronLeft} />  
    :
    <>
    <div id="disabledChevronLeft"><FontAwesomeIcon role="button" color="gray" size = "lg"  icon={faChevronLeft} /></div>
    <Tooltip placement="bottom" isOpen={disabledChevronTooltipOpen} target="disabledChevronLeft" toggle={() => setdisabledChevronTooltipOpen(!disabledChevronTooltipOpen)}>
    You are on the first page already. 
    </Tooltip>
    </>
    }

    &nbsp;
    &nbsp;

    {activePageIndex + 1} / {diaryPagesLength}

    &nbsp;
    &nbsp;

    {activePageIndex !== diaryPagesLength - 1
    ? 
    <FontAwesomeIcon onClick={() => changePage(1)} role="button"  size = "lg"  icon={faChevronRight} />  
    :
    <>
    <div onClick = {createNewPage} ref= {disabledChevronRightRef}><FontAwesomeIcon role="button" size = "lg"  icon={faPen} /></div>
    <Tooltip placement="bottom" isOpen={disabledChevronRightTooltipOpen}  target={disabledChevronRightRef} toggle={() => setdisabledChevronRightTooltipOpen(!disabledChevronRightTooltipOpen)}>
    Create new notebook page. 
    </Tooltip>
    </>
    }

    </div>
    &nbsp;
    &nbsp;
    <div className="userControlsRow">

        {editMode ?
        <>
        <div className = 'stopEditButton' onClick={changeEditModeOn}>
        <span role="button" ><FontAwesomeIcon  size = "lg"  icon={faBookReader} />&nbsp; Stop editing</span>
      
        </div>
        
        &nbsp;
        &nbsp;

        
        <div role="button" id = "saveButton" onClick={save}>
        <FontAwesomeIcon size='lg' ref = {saveIconRef} icon={faFloppyDisk} />&nbsp; Save</div>
        <Tooltip placement="bottom" isOpen={saveTooltipOpen} target={saveIconRef} toggle={() => setsaveTooltipOpen(!saveTooltipOpen)}>
                save progress
          </Tooltip>


        &nbsp;
        &nbsp;

        <div role="button" id = "saveButton" onClick={deletePage}>
        <FontAwesomeIcon size='lg' ref = {saveIconRef} icon={faTrash} />&nbsp; Delete</div>
        <Tooltip placement="bottom" isOpen={saveTooltipOpen} target={saveIconRef} toggle={() => setsaveTooltipOpen(!saveTooltipOpen)}>
                delete page
        </Tooltip>
        </>
        :
        <div className ='editButton' onClick={changeEditModeOn}>
        <FontAwesomeIcon role="button" ref={editIconRef} size = "lg"  icon={faPen} />
        <Tooltip placement="bottom" isOpen={editTooltipOpen} target={editIconRef} toggle={() => seteditTooltipOpen(!editTooltipOpen)}>
          turn edit mode on
        </Tooltip>
        </div>
        }
    </div>
</div>
  )
}

export default UserControls