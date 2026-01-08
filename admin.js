import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("addTeacherBtn").addEventListener("click", async () => {
  const name = document.getElementById("tName").value;
  const dept = document.getElementById("tDept").value;
  const subject = document.getElementById("tSubject").value;

  if (!name || !dept || !subject) {
    alert("Fill all fields");
    return;
  }

  const email = `${name.replace(/\s/g, "")}@teacher.com`;
  const password = "teacher123";

  try {
  const userCred =
    await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    name,
    email,
    department: dept,
    subject,
    role: "teacher",
    approved: true
  });

  alert(`Teacher created\nEmail: ${email}\nPassword: teacher123`);

} catch (error) {
  if (error.code === "auth/email-already-in-use") {
    alert("Teacher already exists in system");
  } else {
    alert(error.message);
  }
}



  alert(`Teacher created\nEmail: ${email}\nPassword: teacher123`);
});


// approve student
async function loadPendingStudents() {
  const snap = await getDocs(collection(db, "users"));
  const box = document.getElementById("studentApprovalList");
  box.innerHTML = "";

  snap.forEach((d) => {
    const u = d.data();
    if (u.role === "student" && u.approved === false) {
      const btn = document.createElement("button");
      btn.textContent = `Approve ${u.name}`;
      btn.onclick = async () => {
        await updateDoc(doc(db, "users", d.id), { approved: true });
        loadPendingStudents();
      };
      box.appendChild(btn);
    }
  });
}

loadPendingStudents();

document.getElementById("logoutBtn").onclick = () => signOut(auth);
