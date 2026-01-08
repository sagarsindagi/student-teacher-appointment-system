import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const page = location.pathname.split("/").pop();

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  const role = snap.data().role;

  if (page === "admin.html" && role !== "admin") {
    location.href = "login.html";
  }

  if (page === "teachers.html" && role !== "teacher") {
    location.href = "login.html";
  }

  if (page === "student.html" && role !== "student") {
    location.href = "login.html";
  }
});
