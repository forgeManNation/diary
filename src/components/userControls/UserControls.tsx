import React, { SyntheticEvent } from 'react'
import {Popover, Tooltip, PopoverBody} from "reactstrap"
import {faUser, faFilePen,  faImage, faCog, faBookReader, faCheck, faXmark, faFloppyDisk} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from 'firebase/auth'
import {signOut, auth, updateProfile} from "../../firebase"
import { useNavigate } from 'react-router-dom'
import "./userControls.scss"


interface Props {
  editMode: boolean,
  user: User,
  triggerSave: () => void,
  triggerChangeProfileAlert: () => void
  triggerWrongUserPicUrlAlert: () => void
}

const UserControls = ({editMode, user, triggerSave, triggerChangeProfileAlert, triggerWrongUserPicUrlAlert}: Props) => {

  const [userTooltipOpen, setuserTooltipOpen] = React.useState(false)
  const [editTooltipOpen, seteditTooltipOpen] = React.useState(false)
  const editIconRef = React.useRef(null)
  const [saveTooltipOpen, setsaveTooltipOpen] = React.useState(false)
  const saveIconRef = React.useRef(null)
  const [profilePicInputValue, setprofilePicInputValue] = React.useState("")
  const navigate = useNavigate();

  const [changeProfilePictureInputOn, setchangeProfilePictureInputOn] = React.useState(false)


async function triggerChangeProfile (){

  //check whether inputed url is valid
  const res = await fetch(profilePicInputValue);
  const buff = await res.blob();
  const validUrl =  buff.type.startsWith('image/')

  if(validUrl){
  await updateProfile(user, {'displayName': user.displayName, 
  'photoURL': profilePicInputValue} ); 
  setchangeProfilePictureInputOn(false)
  triggerChangeProfileAlert()
  }
  else{
    triggerWrongUserPicUrlAlert()
  }
}


function onProfilePicUrlChange (e : SyntheticEvent) {
  e.preventDefault()
}

  function changeEditModeOn() {
    
    if(editMode){
    navigate('/');
    }
    else{
    navigate('/edit')
    }
  }


  return (
    <div className='userControls'>
        <span id = "userIcon">
        {user.photoURL ?
        <img src={user.photoURL} style = {{borderRadius: "25px"}} width = "40px" height="40px" alt="user"/>
        :
        <FontAwesomeIcon icon={faUser} />
        }&nbsp;&nbsp;{user.displayName}</span>
      <Popover placement="bottom"  isOpen={userTooltipOpen} trigger = "hover" target="userIcon" toggle={() => setuserTooltipOpen(!userTooltipOpen)} >
      <PopoverBody>
          <ul className='list-unstyled m-0 '>
            <li role="button" onClick={() => {signOut(auth)}}>log off&nbsp;&nbsp;<FontAwesomeIcon icon={faUser} /></li>
            <li role= "button" >
              <span onClick={() => {setchangeProfilePictureInputOn(!changeProfilePictureInputOn)}}>change profile picture&nbsp;&nbsp;<FontAwesomeIcon icon={faImage} /></span>
              &nbsp;&nbsp;{changeProfilePictureInputOn ? 
              <>
              <input onClick={onProfilePicUrlChange} value = {profilePicInputValue} onChange = {e => {setprofilePicInputValue(e.target.value)}} placeholder = "add url to profile picture"></input>
              &nbsp;&nbsp;
              <FontAwesomeIcon onClick={triggerChangeProfile} id = "userIcon" icon={faCheck} />
              &nbsp;&nbsp;
              <FontAwesomeIcon onClick={() => {setchangeProfilePictureInputOn(false)}} id = "userIcon" icon={faXmark} />
              </>
              :
              <></>} 
            </li>
            </ul>
      
          </PopoverBody>
    </Popover>

    &nbsp;
    &nbsp;

    <div id='editButton' onClick={changeEditModeOn}>
        <FontAwesomeIcon ref={editIconRef} size = "lg"  icon={editMode ? faBookReader : faFilePen} />&nbsp; Edit
        <Tooltip placement="bottom" isOpen={editTooltipOpen} target={editIconRef} toggle={() => seteditTooltipOpen(!editTooltipOpen)}>
              {editMode ? "turn edit mode off" : "turn edit mode on"} 
        </Tooltip>
    </div>

    &nbsp;
    &nbsp;

    {editMode ? 
    <>
    <div role="button" id = "saveButton" onClick={triggerSave}>
      <FontAwesomeIcon size='lg' ref = {saveIconRef} icon={faFloppyDisk} />&nbsp; Save</div>
      <Tooltip placement="bottom" isOpen={saveTooltipOpen} target={saveIconRef} toggle={() => setsaveTooltipOpen(!saveTooltipOpen)}>
              save progress
        </Tooltip>
      </>
      : <></>}

    


</div>
  )
}

export default UserControls