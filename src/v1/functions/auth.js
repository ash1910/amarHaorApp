import { storeData, storeDataJSON, getData, getDataJSON, removeData } from "../functions/AsyncStorageFunctions";

const isLoggedIn = async () => { 
    try {
        if(await getData("isLoggedIn") == "true"){
            return true;
        }
        return false;
    } catch (error) {
        alert(error);
        return false;
    }
};

const getCurrentUser = async () => { 
    try {
        return getDataJSON("currentUser") || {}
    } catch (error) {
        alert(error);
    }
};

const loginInStorage = async (user) => { 
    try {
        await storeDataJSON("currentUser", user);
        await storeData("token", user.token || "");
        await storeData("isLoggedIn", "true"); // store only string
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};

const doLogin = async (user, auth, props) => {
    if(await loginInStorage(user)){
        auth.setIsLoggedIn(true)
        auth.setCurrentUser(user)
        auth.setToken(user.token || null)
        return true;
        //alert("Logged in successfully");
        //props.navigation.navigate("Home");
    }
    return false;
}; 

const updateCurrentUser = async (values, auth) => {
    try{
        let currentUser = await getCurrentUser();
        let user = {...currentUser, ...values};
        //console.log(user, "user");
        await storeDataJSON("currentUser", user);
        auth.setCurrentUser(user);
    }
    catch (error) {
        alert(error);
        return false;
    }
}; 

const doForgotPassword = async (token) => {
    try {
        await storeData("tokenForgotPassword", token || "");
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
}; 

const getForgotPassword = async () => { 
    try {
        return getData("tokenForgotPassword") || ""
    } catch (error) {
        alert(error);
    }
};

const logoutFromStorage = async () => { 
    try {
        await removeData("isLoggedIn");
        await removeData("token");
        await removeData("currentUser");
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};

const doLogout = async (auth, props) => {
    if(await logoutFromStorage()){
      auth.setIsLoggedIn(false)
      auth.setCurrentUser({})
      auth.setToken(null)
      return true;
      //alert("Logout successfully.");
      //props.navigation.navigate("Welcome");
    }
    return false;
}; 

const getFiles = async () => { 
    try {
        return await getDataJSON("files") || []
    } catch (error) {
        alert(error);
    }
};

const setFiles = async (file_id, file_uri) => {
    try {
        let files = await getFiles();
        files[file_id] = file_uri;

        await storeDataJSON("files", files);
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};

const removeFile = async (file_id) => {
    try {
        let files = await getFiles();
        if( files[file_id] ){
            files.splice(file_id, 1);
            await storeDataJSON("files", files);
        }
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};

const setAdminToken = async (auth, user) => {
    try {
        storeData("token", user.token || "");
        auth.setToken(user.token || null);
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};


export { isLoggedIn, getCurrentUser, doLogin, doLogout, doForgotPassword, getForgotPassword, setFiles, getFiles, removeFile, updateCurrentUser, setAdminToken };