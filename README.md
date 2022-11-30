# Online diary 

## About
Online diary is a diary where you can add text, pictures and maps on each of your pages. Pages are dynamicaly created by user.  


## Technology specification
App frontend is made with React and typescript. Routing is handled via react router. 

Aplication is full stack and backend is made in firebase cloud ecosystem. Each user has its own firestore database collection and firebase storage folder
accesible after his authentification. App uses redux and everytime the users data change, firestore and fire storage are updated as well. Pictures (including maps that are stored as poictures after its creation) are stored in firebase cloud storage


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

