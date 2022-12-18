import React from 'react'
import { Tooltip } from 'reactstrap'
import {
  faBookReader,
  faChevronLeft,
  faChevronRight,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import './userControls.scss'
import UserIconWithPopover from './UserIconWithPopover'
import { User } from 'firebase/auth'

interface Props {
  editMode: boolean
  deletePage: () => void
  createNewPage: () => void
  activePageIndex: number
  diaryPagesLength: number
  changePage: (numToChangeIndex: number) => void
  triggerChangeProfileAlert: () => void
  triggerWrongUserPicUrlAlert: () => void
  user: User,
  changeDiaryName: (newDiaryName: string) => void
}

const UserControls = ({
  editMode,
  deletePage,
  activePageIndex,
  diaryPagesLength,
  changePage,
  createNewPage,
  triggerChangeProfileAlert,
  triggerWrongUserPicUrlAlert,
  user,
  changeDiaryName
}: Props) => {

  const editIconRef = React.useRef(null)
  const saveIconRef = React.useRef(null)
  const disabledChevronRightRef = React.useRef(null)

  const [editTooltipOpen, seteditTooltipOpen] = React.useState(false)
  const [deleteTooltipOpen, setdeleteTooltipOpen] = React.useState(false)
  const [disabledChevronTooltipOpen, setdisabledChevronTooltipOpen] =
    React.useState(false)
  const [disabledChevronRightTooltipOpen, setdisabledChevronRightTooltipOpen] =
    React.useState(false)


  const navigate = useNavigate()

  function changeEditModeOn() {
    if (editMode) {
      navigate('/')
    } else {
      navigate('/edit')
    }
  }

  return (
    <div className='userControls'>
      <div className='userControlsRow'>
        {activePageIndex !== 0 ? (
          <FontAwesomeIcon
            role='button'
            onClick={() => {
              changePage(-1)
            }}
            size='lg'
            icon={faChevronLeft}
          />
        ) : (
          <>
            <div id='disabledChevronLeft'>
              <FontAwesomeIcon
                role='button'
                color='gray'
                size='lg'
                icon={faChevronLeft}
              />
            </div>
            <Tooltip
              placement='bottom'
              isOpen={disabledChevronTooltipOpen}
              target='disabledChevronLeft'
              toggle={() =>
                setdisabledChevronTooltipOpen(!disabledChevronTooltipOpen)
              }
            >
              You are on the first page already.
            </Tooltip>
          </>
        )}
        <span className='pageNumber'> {activePageIndex + 1} / {diaryPagesLength}</span>
        {activePageIndex !== diaryPagesLength - 1 ? (
          <FontAwesomeIcon
            onClick={() => changePage(1)}
            role='button'
            size='lg'
            icon={faChevronRight}
          />
        ) : (
          <>
            <div onClick={createNewPage} ref={disabledChevronRightRef}>
              <FontAwesomeIcon role='button' size='lg' icon={faPen} />
            </div>
            <Tooltip
              placement='bottom'
              isOpen={disabledChevronRightTooltipOpen}
              target={disabledChevronRightRef}
              toggle={() =>
                setdisabledChevronRightTooltipOpen(
                  !disabledChevronRightTooltipOpen
                )
              }
            >
              Create new notebook page.
            </Tooltip>
          </>
        )}
      </div>
      <div className='userControlsRow'>
        {editMode ? (
          <>
            <div role="button" onClick={changeEditModeOn}>
              <FontAwesomeIcon size='lg' ref={editIconRef} icon={faBookReader} />
            </div>
            <Tooltip
              placement='bottom'
              isOpen={editTooltipOpen}
              target={editIconRef}
              toggle={() => seteditTooltipOpen(!editTooltipOpen)}
            >
              change edit mode
            </Tooltip>
            &nbsp; &nbsp;
            <div role='button' onClick={deletePage}>
              <FontAwesomeIcon size='lg' ref={saveIconRef} icon={faTrash} />
            </div>
            <Tooltip
              placement='bottom'
              isOpen={deleteTooltipOpen}
              target={saveIconRef}
              toggle={() => setdeleteTooltipOpen(!deleteTooltipOpen)}
            >
              delete page
            </Tooltip>
          </>
        ) : (
          <div className='editButton' onClick={changeEditModeOn}>
            <FontAwesomeIcon
              role='button'
              ref={editIconRef}
              size='lg'
              icon={faPen}
            />

          </div>
        )}
      </div>
      <div className='userControlsRow'>
        <UserIconWithPopover
          changeDiaryName={changeDiaryName}
          user={user}
          triggerChangeProfileAlert={triggerChangeProfileAlert}
          triggerWrongUserPicUrlAlert={triggerWrongUserPicUrlAlert}
        ></UserIconWithPopover>
      </div>
    </div>
  )
}

export default UserControls
