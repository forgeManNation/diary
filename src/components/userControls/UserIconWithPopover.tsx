import React, { SyntheticEvent, useEffect } from 'react'
import { User } from 'firebase/auth'
import {faUser, faXmark, faCheck, faImage} from '@fortawesome/free-solid-svg-icons'
import {Popover, PopoverBody} from "reactstrap"
import {signOut, auth, updateProfile} from "../../firebase"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




interface Props {
    user: User,
    triggerChangeProfileAlert: () => void
    triggerWrongUserPicUrlAlert: () => void
  }

const UserIconWithPopover = ({user, triggerChangeProfileAlert, triggerWrongUserPicUrlAlert}: Props) => {
  

  const [changeProfilePictureInputOn, setchangeProfilePictureInputOn] = React.useState(false)
  const [profilePicInputValue, setprofilePicInputValue] = React.useState("")
  const [userTooltipOpen, setuserTooltipOpen] = React.useState(false)
  const [isImageUrlValid, setisImageUrlValid] = React.useState(false)

  function onProfilePicUrlChange (e : SyntheticEvent) {
    e.preventDefault()
  }

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

    async function checkImage(url : string){
     
        const res = await fetch(url);
        const buff = await res.blob();
       
        if(buff.type.startsWith('image/')){
          setisImageUrlValid(true)
        }
   
   }
    
   useEffect(() => {
    
    if(user.photoURL !== null){
    checkImage(user.photoURL)
    }

   }, [user.photoURL])
   
  
    return (
    <>
    <span id = "userIcon">
        {user.photoURL && isImageUrlValid ?
        <img src={user.photoURL} className = "userImage" width = "45px" height="45px" alt={String(user.displayName)}/>
        :
        <FontAwesomeIcon icon={faUser} />
        }
        </span>
        <Popover placement="bottom"  isOpen={userTooltipOpen} trigger = "hover" target="userIcon" toggle={() => setuserTooltipOpen(!userTooltipOpen)} >
        <PopoverBody>
          <h5 className = "popoverUsername">{['user',null ,""].includes(user.displayName) ? user.email : user.displayName}</h5>
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
    </>
  )
}

export default UserIconWithPopover