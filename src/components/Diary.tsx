import React, { useRef, useState, useEffect } from "react";
import Page from "./page/Page";
import "./diary.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsSpin } from "@fortawesome/free-solid-svg-icons";
import { db, getDoc, setDoc, doc } from "../firebase";
import { Alert } from "reactstrap";
import { User } from "firebase/auth";
import UserControls from "./userControls/UserControls";
import UserIconWithPopover from "./userControls/UserIconWithPopover";
import { LatLng } from "leaflet";
import { storage, ref, uploadBytes, getBlob, listAll, auth } from "../firebase";
// import { async } from '@firebase/util'

interface Props {
  editMode: boolean;
  user: User;
  triggerWrongUserPicUrlAlert: () => void;
  triggerChangeProfileAlert: () => void;
  triggerCreateNewDiaryPageAlert: () => void;
  triggerSaveAlert: () => void;
}

interface page {
  text: string;
  images: Blob[];
}

const Diary = ({
  editMode,
  user,
  triggerWrongUserPicUrlAlert,
  triggerChangeProfileAlert,
  triggerCreateNewDiaryPageAlert,
  triggerSaveAlert,
}: Props) => {
  //all of the diary content is stored in this array
  const [diaryPages, setdiaryPages] = useState<page[]>([]);

  const [diaryName, setdiaryName] = useState("Diary of smiling pirate");
  // const [images, setimages] = useState<Blob[]>([])
  const [successfullSaveAlertOpen, setsuccessfullSaveAlertOpen] =
    useState(false);
  const [successProfilePictureAlertOpen, setsuccessProfilePictureAlertOpen] =
    useState(false);
  const [wrongUserPicAlertOpen, setwrongUserPicAlertOpen] = useState(false);
  const [activePageIndex, setactivePageIndex] = useState(0);
  const [newPageAlertOpen, setnewPageAlertOpen] = useState(false);
  const [userId, setuserId] = useState("");

  const defaultUserName = "adventurer";
  const newUserFirstDiaryPage: page = {
    text: "This is your first diary page :) write as you wish",
    images: [],
  };

  useEffect(() => {
    async function getUserId() {
      setuserId(await user.getIdToken(false));
    }
    getUserId();
  }, []);

  //initial load of data from firestore database
  useEffect(() => {
    //initial load of data from firestore database
    async function getDataFromDb() {
      try {
        const docRef = doc(db, "users", userId);

        let docSnap = await getDoc(docRef);

        //if user does not have a firestore database create new firestore database
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            diaryName:
              (user.displayName ? user.displayName : defaultUserName) +
              "'s diary",
            contents: [newUserFirstDiaryPage],
            username: user.displayName,
          });

          docSnap = await getDoc(docRef);
        }

        //the retrieved data form database
        let diaryDataFromDatabase = docSnap.data();

        console.log(diaryDataFromDatabase, "the real heroes");

        //if fetch to database was succesful
        if (diaryDataFromDatabase) {
          setdiaryName(diaryDataFromDatabase.diaryName);
          console.log("last time i saw you");

          let newDiaryPages = await Promise.all(
            diaryDataFromDatabase.contents.map(
              async ({ text, images }: { text: string; images: string[] }) => {
                try {
                  const promises = await Promise.all(
                    images.map(
                      async (image) => await getBlob(ref(storage, image))
                    )
                  );

                  return {
                    images: promises,
                    text: text,
                  };
                } catch (error) {
                  console.log(error, "neeeeeee");
                }
              }
            )
          );

          console.log(newDiaryPages, "tak a je to");

          setdiaryPages(newDiaryPages);
          console.log(diaryDataFromDatabase, "XD >D ;D ;) ') ");
        } else {
          alert("could not retrieve data from database");
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (userId) {
      getDataFromDb();
    }
  }, [userId]);

  async function saveToDb() {
    if (userId) {
      //handling firestore saving
      const docRef = doc(db, "users", userId);

      const diaryPagesCopy = [...diaryPages];
      const reformedDiaryPages = diaryPagesCopy.map((page, index) => {
        console.log(page, "log me page");
        let imagesCopy = page.images;
        const imagesReferences = imagesCopy.map((image, index) => {
          //handling fire storage saving
          const storageRef = ref(
            storage,
            `/${userId}/${activePageIndex}/image-${index}`
          );

          uploadBytes(storageRef, image).then((snapshot) => {
            alert("Uploaded a blob or file!");
          });

          return `/${userId}/${activePageIndex}/image-${index}`;
        });

        console.log("imagesCopy", imagesCopy);

        const newPage = { text: page.text, images: imagesReferences };
        // page.images = imagesReferences

        return newPage;
      });

      console.log(reformedDiaryPages, "NIMBUS 2000");

      await setDoc(docRef, {
        diaryName: diaryName,
        username: user.displayName,
        contents: reformedDiaryPages,
      });
    }
  }
  useEffect(() => {
    saveToDb();
    console.log("succesfully saved");
  }, [diaryPages]);

  async function save() {
    await saveToDb();
    triggerSaveAlert();
  }

  function deletePage() {
    if (
      diaryPages.length > 1 &&
      window.confirm("Are you sure you want to delete this diary page?")
    ) {
      // let diaryPagesCopy = [...diaryPages]
      const diaryPagesCopy = [...diaryPages];
      diaryPagesCopy.splice(activePageIndex, 1);
      // setdiaryPages(diaryPagesCopy)
      saveToDb();

      if (activePageIndex !== 0) changePage(-1);
      else changePage(1);
    } else if (diaryPages.length <= 1) {
      window.alert("You can't delete the only page");
    }
  }

  async function createNewPage() {
    const diaryPagesCopy = [...diaryPages];
    diaryPagesCopy.push({ text: "New page content", images: [] });
    setdiaryPages(diaryPagesCopy);
    await saveToDb();
    changePage(+1);
    triggerCreateNewDiaryPageAlert();
  }

  function changePageImagesValue(newPageImages: Blob[]) {
    let diaryPagesCopy = [...diaryPages];
    diaryPagesCopy[activePageIndex].images = newPageImages;
    setdiaryPages(diaryPagesCopy);
  }

  //saving user inputed text in global variable diaryPages
  function changePageTextValue(newPageTextContent: string) {
    let diaryPagesCopy = [...diaryPages];
    diaryPagesCopy[activePageIndex].text = newPageTextContent;
    setdiaryPages(diaryPagesCopy);
  }

  function changePage(numToChangeIndex: number) {
    setactivePageIndex(activePageIndex + numToChangeIndex);
  }

  //page that is open right now
  const openedPage = diaryPages[activePageIndex];

  return (
    <div className="app">
      {/* <h1 className='title'>{diaryName}</h1> */}

      <UserIconWithPopover
        triggerWrongUserPicUrlAlert={triggerWrongUserPicUrlAlert}
        triggerChangeProfileAlert={triggerChangeProfileAlert}
        user={user}
      ></UserIconWithPopover>

      {openedPage !== undefined ? (
        <Page
          editMode={editMode}
          changePageImagesValue={changePageImagesValue}
          changePageTextValue={changePageTextValue}
          text={openedPage.text}
          key={"page" + activePageIndex}
          index={activePageIndex}
          images={openedPage.images}
        />
      ) : (
        <FontAwesomeIcon
          className="spinningIcon  fa-spin"
          role="button"
          color="black"
          size="lg"
          icon={faArrowsSpin}
        />
      )}
      <UserControls
        deletePage={deletePage}
        createNewPage={createNewPage}
        changePage={changePage}
        diaryPagesLength={diaryPages.length}
        activePageIndex={activePageIndex}
        editMode={editMode}
        save={save}
      ></UserControls>
    </div>
  );
};

export default Diary;
