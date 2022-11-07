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
import { UploadResult } from "firebase/storage"

interface Props {
  editMode: boolean;
  user: User;
  triggerWrongUserPicUrlAlert: () => void;
  triggerChangeProfileAlert: () => void;
  triggerCreateNewDiaryPageAlert: () => void
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
  triggerCreateNewDiaryPageAlert
}: Props) => {
  //all of the diary content is stored in this array
  const [diaryPages, setdiaryPages] = useState<page[]>([]);
  const [diaryName, setdiaryName] = useState("Diary of smiling pirate");
  const [activePageIndex, setactivePageIndex] = useState(0);

  const userId = user.uid;
  console.log(userId, "this is the static? user id");
  const defaultUserName = "adventurer";
  const newUserFirstDiaryPage: page = {
    text: "This is your first diary page :) write as you wish",
    images: [],
  };

  //initial load of data from firestore database
  useEffect(() => {
    //initial load of data from firestore database
    async function getDataFromDb() {
      try {
        const docRef = doc(db, "users", userId);

        let docSnap = await getDoc(docRef);

        //if user does not have a firestore database create new firestore database
        if (!docSnap.exists()) {
          console.log('creating the snap for the first time');

          await setDoc(docRef, {
            //creating the diary name by refactoring user name and using default username in case that user did not input any
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

          console.log(diaryDataFromDatabase, 'i did some mistake, didnt I?');

          let newDiaryPages = await Promise.all(
            diaryDataFromDatabase.contents.map(
              async ({ text, images }: { text: string; images: string[] }) => {
                try {

                  console.log(images, "what are the images");

                  const imagePromises = images.map(async (image) => {
                    const refToImage = ref(storage, image)
                    return await getBlob(refToImage)
                  }
                  )

                  const promises = await Promise.all(
                    imagePromises
                  );

                  console.log(promises, "moje promisy");


                  return {
                    images: promises,
                    text: text,
                  };
                } catch (error) {
                  alert('this is the place where the error is')
                  console.log(error.message, "neeeeeee");
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
        console.log(error, "got an error while getting data from database");
      }
    }
    if (userId) {
      getDataFromDb();
    }
  }, [userId]);

  async function saveToDb(userId: string) {

    //handling firestore saving
    const docRef = doc(db, "users", userId);

    const diaryPagesCopy = [...diaryPages];
    const reformedDiaryPages = diaryPagesCopy.map((page, index) => {
      let imagesCopy = Object.assign(page.images);


      console.log(imagesCopy, "this is imagesCopy");



      //saving images
      const imagesReferences = imagesCopy.map((image: Blob, index: number) => {

        return `/${userId}/${activePageIndex}/image-${index}`;
      })

      console.log(imagesReferences, "images references");


      const newPage = { text: page.text, images: imagesReferences };

      return newPage;
    });


    const listOfUnfulfilledPromisesToUploadImagesToStorage: Array<Array<Promise<UploadResult>>> = []

    diaryPagesCopy.forEach((page: page, diaryPageIndex: number) => {
      listOfUnfulfilledPromisesToUploadImagesToStorage.push([])
      page.images.forEach((image, index) => {
        //handling fire storage saving
        const storageRef = ref(
          storage,
          `/${userId}/${diaryPageIndex}/image-${index}`
        );

        listOfUnfulfilledPromisesToUploadImagesToStorage[diaryPageIndex].push(uploadBytes(storageRef, image))
      });
    })


    const promise4all = await Promise.all(
      listOfUnfulfilledPromisesToUploadImagesToStorage.map(function (innerPromiseArray) {
        return Promise.all(innerPromiseArray);
      })
    )

    console.log(promise4all, "promise4all :( :((");


    console.log(reformedDiaryPages, "reformed diary pages right before setDoc");



    await setDoc(docRef, {
      diaryName: diaryName,
      username: user.displayName,
      contents: reformedDiaryPages,
    });

    alert('everything was saved into database')

  }
  // // useEffect(() => {
  // //   saveToDb(userId);

  // //   console.log("succesfully saved");
  // // }, [diaryPages]);



  function deletePage() {
    if (
      diaryPages.length > 1 &&
      window.confirm("Are you sure you want to delete this diary page?")
    ) {
      // let diaryPagesCopy = [...diaryPages]
      const diaryPagesCopy = [...diaryPages];
      diaryPagesCopy.splice(activePageIndex, 1);
      // setdiaryPages(diaryPagesCopy)
      saveToDb(userId);

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
    await saveToDb(userId);
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
      <h1 className='title'>{diaryName}</h1>

      {/* <UserIconWithPopover
        triggerWrongUserPicUrlAlert={triggerWrongUserPicUrlAlert}
        triggerChangeProfileAlert={triggerChangeProfileAlert}
        user={user}
      ></UserIconWithPopover> */}

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
        user={user}
        triggerChangeProfileAlert={triggerChangeProfileAlert}
        triggerWrongUserPicUrlAlert={triggerWrongUserPicUrlAlert}
      ></UserControls>
      <button className="btn btn-primary" onClick={() => { saveToDb(userId) }}></button>
    </div>
  );
};

export default Diary;
