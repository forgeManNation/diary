import React, { useState } from "react";
import { Alert } from "reactstrap";
import { User } from "firebase/auth";
import DiaryApp from "./DiaryApp";
import "./diaryAppWithAlerts.css"

interface Props {
  editMode: boolean;
  user: User;
}

const DiaryWithAlerts = ({ editMode, user }: Props) => {
  const [successProfilePictureAlertOpen, setsuccessProfilePictureAlertOpen] =
    useState(false);
  const [wrongUserPicAlertOpen, setwrongUserPicAlertOpen] = useState(false);
  const [newPageAlertOpen, setnewPageAlertOpen] = useState(false);
  const [changeNameAlertOpen, setchangeNameAlertOpen] = useState(false);


  //time alert will be shown by default in miliseconds
  const alertShownTime = 5000;


  //timer ID -> used for clearing timeout when the data are saved to early
  let triggerCreateNewDiaryPageAlerttimerID: ReturnType<typeof setTimeout>;
  function triggerCreateNewDiaryPageAlert() {
    //clearing timeout of alert display when the another new page is created too early from the previous saving
    clearTimeout(triggerCreateNewDiaryPageAlerttimerID);
    setnewPageAlertOpen(true);

    triggerCreateNewDiaryPageAlerttimerID = setTimeout(function () {
      setnewPageAlertOpen(false);
    }, alertShownTime);
  }

  //timer ID -> used for clearing timeout when the data are saved to early
  let changeProfileAlerttimerID: ReturnType<typeof setTimeout>;
  function triggerChangeProfileAlert() {
    clearTimeout(changeProfileAlerttimerID);
    setsuccessProfilePictureAlertOpen(true);
    changeProfileAlerttimerID = setTimeout(function () {
      setsuccessProfilePictureAlertOpen(false);
    }, alertShownTime);
  }

  //timer ID -> used for clearing timeout when the data are saved to early
  let changeWrongUserPicTimerID: ReturnType<typeof setTimeout>;
  function triggerWrongUserPicUrlAlert() {
    clearTimeout(changeWrongUserPicTimerID);
    setwrongUserPicAlertOpen(true);
    changeWrongUserPicTimerID = setTimeout(function () {
      setwrongUserPicAlertOpen(false);
    }, alertShownTime);
  }

  //timer ID -> used for clearing timeout when the data are saved to early
  let changeNameAlerttimerID: ReturnType<typeof setTimeout>;
  function triggerChangeNameAlert() {
    clearTimeout(changeNameAlerttimerID);
    setchangeNameAlertOpen(true);
    changeNameAlerttimerID = setTimeout(function () {
      setchangeNameAlertOpen(false);
    }, alertShownTime);
  }

  return (
    <div>
      <DiaryApp
        editMode={editMode}
        user={user}
        triggerChangeNameAlert={triggerChangeNameAlert}
        triggerCreateNewDiaryPageAlert={triggerCreateNewDiaryPageAlert}
        triggerChangeProfileAlert={triggerChangeProfileAlert}
        triggerWrongUserPicUrlAlert={triggerWrongUserPicUrlAlert}
      />

      <div className="alertBox">

        <Alert
          isOpen={newPageAlertOpen}
          toggle={() => {
            setnewPageAlertOpen(false);
          }}
          color="success"
        >
          New page created!
        </Alert>

        <Alert
          isOpen={successProfilePictureAlertOpen}
          toggle={() => {
            setsuccessProfilePictureAlertOpen(false);
          }}
          color="success"
        >
          Succesfully updated profile picture!
        </Alert>


        <Alert
          isOpen={changeNameAlertOpen}
          toggle={() => {
            setchangeNameAlertOpen(false);
          }}
          color="success"
        >
          Succesfully changed diary name!
        </Alert>


        <Alert
          isOpen={wrongUserPicAlertOpen}
          toggle={() => {
            setwrongUserPicAlertOpen(false);
          }}
          color="danger"
        >
          Can't update profile picture. Try different URL.
        </Alert>
      </div>
    </div>
  );
};

export default DiaryWithAlerts;
