import { getAuth } from "firebase/auth";
import { firebaseApp } from "./FirebaseConfig";

export const auth = getAuth(firebaseApp);
