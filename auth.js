import { auth, db } from  "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


   //student registeration

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
      name,
      email,
      role: "student",
      approved: false
    });

    document.getElementById("registerMsg").innerText =
      "Registered successfully. Wait for admin approval.";
  });
}


   //login

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const snap = await getDoc(doc(db, "users", userCred.user.uid));

    if (!snap.exists()) {
      alert("User record not found");
      signOut(auth);
      return;
    }

    const data = snap.data();

    if (!data.approved) {
      alert("Admin approval pending");
      signOut(auth);
      return;
    }

    if (data.role === "admin") location.href = "admin.html";
    if (data.role === "teacher") location.href = "teachers.html";
    if (data.role === "student") location.href = "student.html";
  });
}
