import React, { SyntheticEvent } from 'react'
import {Popover, Tooltip, PopoverBody} from "reactstrap"
import {faUser, faPencil, faFilePen,  faImage, faCog, faBookReader, faCheck, faXmark, faFloppyDisk} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from 'firebase/auth'
import {signOut, auth, updateProfile} from "../../firebase"
import { useNavigate } from 'react-router-dom'
import "./userControls.scss"


interface Props {
    editMode: boolean,
  changeUser: (user: User | null) => void,
  user: User,
  changeEditMode: (changeEditModeToOn: boolean) => void,
  triggerSave: () => void,
  triggerChangeProfileAlert: () => void
  triggerWrongUserPicUrlAlert: () => void
}

const UserControls = ({editMode, changeUser, user, changeEditMode, triggerSave, triggerChangeProfileAlert, triggerWrongUserPicUrlAlert}: Props) => {

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
    changeEditMode(true)
    navigate(`/`);
    }
    else{
    changeEditMode(false)
      navigate('/edit')
    }
  }


  return (
    <div className='userControls'>
        {user.photoURL ?
        <img src={user.photoURL} style = {{borderRadius: "25px"}}  id = "userIcon" width = "40px" height="40px" alt="user"/>
        :
        <FontAwesomeIcon id = "userIcon" icon={faUser} />
        }
      <Popover placement="bottom" isOpen={userTooltipOpen} trigger = "hover" target="userIcon" toggle={() => setuserTooltipOpen(!userTooltipOpen)} >
      <PopoverBody>
          <ul className='list-unstyled '>
            <li role="button" onClick={() => {signOut(auth); changeUser(null); }}>log off&nbsp;&nbsp;<FontAwesomeIcon icon={faUser} /></li>
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
            <li role="button" >settings&nbsp;&nbsp;<FontAwesomeIcon icon={faCog} /></li>
            </ul>
          </PopoverBody>
    </Popover>

    &nbsp;
    &nbsp;

    <span onClick={changeEditModeOn}>
        <FontAwesomeIcon ref={editIconRef} size = "2x"  icon={editMode ? faBookReader : faPencil} />
        <Tooltip placement="bottom" isOpen={editTooltipOpen} target={editIconRef} toggle={() => seteditTooltipOpen(!editTooltipOpen)}>
              {editMode ? "turn edit mode off" : "turn edit mode on"} 
        </Tooltip>
    </span>

    &nbsp;
    &nbsp;

    {editMode ? 
    <>
    <div role="button" onClick={triggerSave}>
      <FontAwesomeIcon size='2x' ref = {saveIconRef} icon={faFloppyDisk} /></div>
      <Tooltip placement="bottom" isOpen={saveTooltipOpen} target={saveIconRef} toggle={() => setsaveTooltipOpen(!saveTooltipOpen)}>
              save progress
        </Tooltip>
      </>
        : <></>}
</div>
  )
}

export default UserControls