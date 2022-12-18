import React, { SyntheticEvent, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { faUser, faXmark, faCheck, faImage, faFileText } from '@fortawesome/free-solid-svg-icons'
import { Popover, PopoverBody } from "reactstrap"
import { signOut, auth, updateProfile } from "../../firebase"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  user: User,
  triggerChangeProfileAlert: () => void
  triggerWrongUserPicUrlAlert: () => void
  changeDiaryName: (newDiaryName: string) => void
}

const UserIconWithPopover = ({ user, triggerChangeProfileAlert, triggerWrongUserPicUrlAlert, changeDiaryName }: Props) => {

  const [changeProfilePictureInputOn, setchangeProfilePictureInputOn] = useState(false)
  const [profilePicInputValue, setprofilePicInputValue] = useState(user.photoURL !== null ? user.photoURL : "")
  const [userTooltipOpen, setuserTooltipOpen] = useState(false)
  const [isImageUrlValid, setisImageUrlValid] = useState(false)
  const [changeDiaryNameInputOn, setchangeDiaryNameInputOn] = useState(false)
  const [diaryNameInputValue, setdiaryNameInputValue] = useState("")


  function onChangePreventDefault(e: SyntheticEvent) {
    e.preventDefault()
  }

  async function triggerChangeProfilePicture() {

    //check whether inputed url is valid
    const res = await fetch(profilePicInputValue);
    const buff = await res.blob();
    const validUrl = buff.type.startsWith('image/')

    if (validUrl) {
      await updateProfile(user, {
        'displayName': user.displayName,
        'photoURL': profilePicInputValue
      });
      setchangeProfilePictureInputOn(false)
      triggerChangeProfileAlert()
    }
    else {
      triggerWrongUserPicUrlAlert()
    }
  }

  async function checkImage(url: string) {

    const res = await fetch(url);
    const buff = await res.blob();

    if (buff.type.startsWith('image/')) {
      setisImageUrlValid(true)
    }

  }


  //checking wheter profile picture is valid changing state isImageUrlValid based on validity
  useEffect(() => {
    if (user.photoURL !== null) {
      checkImage(user.photoURL)
    }
  }, [user.photoURL])


  function triggerChangeDiaryName() {
    changeDiaryName(diaryNameInputValue)
  }

  const inputFormToChangeDiaryName = <>
    <br />
    <input className="form-control" type="text" onClick={onChangePreventDefault} value={diaryNameInputValue} onChange={e => { setdiaryNameInputValue(e.target.value) }} placeholder="new diary name"></input>
    &nbsp;&nbsp;&nbsp;
    <span onClick={triggerChangeDiaryName}>Apply&nbsp;<FontAwesomeIcon id="userIcon" icon={faCheck} /></span>
    &nbsp;&nbsp;
    <span onClick={() => { setchangeDiaryNameInputOn(false) }} >Cancel&nbsp;<FontAwesomeIcon id="userIcon" icon={faXmark} /></span>
    <hr />
  </>

  const inputFormChangeProfilePicture = <>
    <input className="form-control" type="text" onClick={onChangePreventDefault} value={profilePicInputValue} onChange={e => { setprofilePicInputValue(e.target.value) }} placeholder="e. g. https://i.imgur.com/your_picture"></input>
    &nbsp;&nbsp;
    <span onClick={triggerChangeProfilePicture}>Apply&nbsp;<FontAwesomeIcon id="userIcon" icon={faCheck} /></span>
    &nbsp;&nbsp;
    <span onClick={() => { setchangeProfilePictureInputOn(false) }}>Cancel&nbsp;<FontAwesomeIcon id="userIcon" icon={faXmark} /></span>
    <hr />
  </>

  return (
    <>
      <span id="userIcon">
        {user.photoURL && isImageUrlValid ?
          <img src={user.photoURL} className="userImage" width="45px" height="45px" alt={String(user.displayName)} />
          :
          <FontAwesomeIcon icon={faUser} />
        }
        &nbsp;
        &nbsp;
        {user.displayName ? user.displayName : user.email ? user.email : "adventurer"}
      </span>
      <Popover placement="bottom" isOpen={userTooltipOpen} trigger="hover" target="userIcon" toggle={() => setuserTooltipOpen(!userTooltipOpen)} >
        <PopoverBody>
          <h5 className="popoverUsername">{['user', null, ""].includes(user.displayName) ? user.email : user.displayName}</h5>
          <ul className='list-unstyled m-0 '>

            <li role="button" >
              <span onClick={() => { setchangeProfilePictureInputOn(!changeProfilePictureInputOn) }}>
                change profile picture&nbsp;&nbsp;<FontAwesomeIcon icon={faImage} /></span>
              &nbsp;&nbsp;
              {changeProfilePictureInputOn ? inputFormChangeProfilePicture : <></>}

            </li>

            <li role="button" onClick={() => { signOut(auth) }}>
              log off&nbsp;&nbsp;<FontAwesomeIcon icon={faUser} />
            </li>


            <li role="button" >
              <span onClick={() => { setchangeDiaryNameInputOn(!changeDiaryNameInputOn) }}>change diary name &nbsp;&nbsp;<FontAwesomeIcon icon={faFileText} /></span>
              &nbsp; &nbsp;
              {changeDiaryNameInputOn ? inputFormToChangeDiaryName : <></>}
            </li>
          </ul>

        </PopoverBody>
      </Popover>
    </>
  )
}

export default UserIconWithPopover