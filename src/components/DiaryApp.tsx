import React, { useRef, useState, useEffect } from "react";
import Pages from "./pages/Pages";
import UserControls from "./userControls/UserControls";
import "./diaryApp.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsSpin } from "@fortawesome/free-solid-svg-icons";
import { User } from "firebase/auth";
import { storage, ref, uploadBytes, getBlob, db, getDoc, setDoc, doc } from "../firebase";
import { UploadResult } from "firebase/storage"

interface Props {
  editMode: boolean;
  user: User;
  triggerWrongUserPicUrlAlert: () => void;
  triggerChangeProfileAlert: () => void;
  triggerCreateNewDiaryPageAlert: () => void;
  triggerChangeNameAlert: () => void;
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
  triggerChangeNameAlert,
}: Props) => {


  const diaryPageInitialText = "This is your first diary page :) write as you wish";

  //all of the diary content is stored in this array
  const [diaryPages, setdiaryPages] = useState<page[]>([]);

  const [diaryName, setdiaryName] = useState("");
  const [activePageIndex, setactivePageIndex] = useState(0);

  const userId = user.uid;
  const defaultUserName = "adventurer";
  const newUserFirstDiaryPage: page = {
    text: diaryPageInitialText,
    images: [],
  };

  function changeDiaryName(newDiaryName: string) {
    setdiaryName(newDiaryName)
    triggerChangeNameAlert()
  }

  //initial load of data from firestore database
  useEffect(() => {

    async function getDataFromDb() {
      try {
        //adding a reference to firestore users collection
        const docRef = doc(db, "users", userId);

        //asynchronously getting the data from user's firestore database
        let docSnap = await getDoc(docRef);

        //if user does not have a firestore database then create new firestore database for him
        if (!docSnap.exists()) {

          //creating the database
          await setDoc(docRef, {
            diaryName:
              //creating the diary name by refactoring username and using default username in case that user did not input any username
              (user.displayName ? user.displayName : defaultUserName) +
              "'s diary",
            contents: [newUserFirstDiaryPage],
            username: user.displayName,
          });

          //asynchronously getting the data after the database was created
          docSnap = await getDoc(docRef);
        }

        //the retrieved data form database
        let diaryDataFromFirestoreDatabase = docSnap.data();


        //if asynchronous loading from database was succesful
        if (diaryDataFromFirestoreDatabase) {

          //in that case change diary name
          setdiaryName(diaryDataFromFirestoreDatabase.diaryName);


          /* than it is needed to get the data that are stored in firestore as 
          string references and asynchronously get them from fire storage
          */

          //this shall create an array of promises to firebase storage, one array item is a promise to all images in one page
          const newDiaryPagesImagePromises = diaryDataFromFirestoreDatabase.contents.map((firestorePage: { images: string[], text: string }, index: number) => {

            //getting all the string image references for the mapped page
            const imageReferences = firestorePage.images;

            //for each image reference get a promise for this image to fire storage
            let imagesWaiting = imageReferences.map(imageReference => {

              //reference object to firebase storage
              const imageStorageReference = ref(storage, imageReference)

              //call to get image from storage
              return getBlob(imageStorageReference)
            })

            //this shall merge all of the firestorage image calls into one single big promise
            return Promise.all(imagesWaiting)
          })

          //resolving all of the promises to firebase storage
          const retrievedImages = await Promise.all(newDiaryPagesImagePromises)

          /*after data from firestore and fire storage are loaded,
           it is needed to create new diary pages object that would merge
           all of the retrived data to one diaryPages object
          */

          //merging firestore and fire storage data into one object
          const newDiaryPages = diaryDataFromFirestoreDatabase.contents.map((diaryPage: { images: string[], text: string }, pageIndex: number) => {

            //replacing firestore string reference with loaded images
            let newDiaryPageImages = diaryPage.images.map((imageReference, imageIndex) => {
              let loadedImage = retrievedImages[pageIndex][imageIndex];
              return loadedImage
            }
            );
            //creating the final object
            const newDiaryPage = diaryPage;
            newDiaryPage.images = newDiaryPageImages;
            return newDiaryPage
          })
          setdiaryPages(newDiaryPages);
        } else {
          alert("could not retrieve data from database");
        }
      } catch (error) {
        alert("could not retrieve data from database");
      }
    }
    if (userId) {
      getDataFromDb();
    }
  }, [userId]);

  /* 
  this use effect handles saving data into the database,
  it fires everytime diaryPages change and it does not
  run on initial render to not save empty diaryPages to database
  */

  //preventing data to be saved on initial render
  const initialRender = useRef(true);

  useEffect(() => {

    async function saveToDb(userId: string) {

      //handling firestore saving
      const docRef = doc(db, "users", userId);

      const diaryPagesCopy = [...diaryPages];
      const reformedDiaryPages = diaryPagesCopy.map((page, pageIndex) => {
        const imagesCopy = Object.assign(page.images);

        //saving images
        const imagesReferences = imagesCopy.map((image: Blob, index: number) => {
          return `/${userId}/${pageIndex}/image-${index}`;
        })

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

      await setDoc(docRef, {
        diaryName: diaryName,
        username: user.displayName,
        contents: reformedDiaryPages,
      });

    }

    if (initialRender.current) {
      initialRender.current = false;
    }
    else {
      saveToDb(userId);
    }
  }, [diaryPages]);



  function deletePage() {
    if (
      diaryPages.length > 1 &&
      window.confirm("Are you sure you want to delete this diary page?")
    ) {
      const diaryPagesCopy = [...diaryPages];
      diaryPagesCopy.splice(activePageIndex, 1);
      setdiaryPages(diaryPagesCopy)
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
      <div>
        <h1 className='title'>{diaryName}</h1>
      </div>

      {openedPage !== undefined ? (
        <Pages
          editMode={editMode}
          changePageImagesValue={changePageImagesValue}
          changePageTextValue={changePageTextValue}
          text={openedPage.text}
          key={"page" + activePageIndex}
          index={activePageIndex}
          images={openedPage.images}
        />
      ) : (
        //spinning icon while data are loading from database
        <FontAwesomeIcon
          className="spinningIcon  fa-spin"
          role="button"
          color="black"
          size="lg"
          icon={faArrowsSpin}
        />
      )}

      <div className="userControlsSegment">
        <UserControls
          changeDiaryName={changeDiaryName}
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
      </div>
    </div>
  );
};

export default Diary;
