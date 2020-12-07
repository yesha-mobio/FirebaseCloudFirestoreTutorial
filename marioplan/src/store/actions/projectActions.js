export const createProject = (project) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    // const firestore = getFirebase().firestore();
    firestore
      .collection("projects")
      .add({
        ...project,
        authorFirstName: "Yesha",
        authorLastName: "Shah",
        authorId: 12345,
        createdAt: new Date(),
      })
      .then(() => {
        return dispatch({
          type: "CREATE_PROJECT",
          project,
        });
      })
      .catch((err) => {
        return dispatch({
          type: "CREATE_PROJECT_ERROR",
          err,
        });
      });
  };
};
