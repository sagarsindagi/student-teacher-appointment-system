import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const teacherSelect = document.getElementById("teacherSelect");
const bookBtn = document.getElementById("bookBtn");
const myAppointments = document.getElementById("myAppointments");


  // load teacher

async function loadTeachers() {
  teacherSelect.innerHTML = `<option value="">Select Teacher</option>`;

  const snap = await getDocs(collection(db, "users"));

  snap.forEach(d => {
    const u = d.data();
    if (u.role === "teacher") {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${u.name} (${u.subject})`;
      teacherSelect.appendChild(opt);
    }
  });
}


 // load student appointment

async function loadMyAppointments(uid) {
  myAppointments.innerHTML = "";

  const q = query(
    collection(db, "appointments"),
    where("studentId", "==", uid)
  );

  const snap = await getDocs(q);

  snap.forEach(d => {
    const a = d.data();

    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.margin = "8px";
    div.style.padding = "8px";
let color = "orange";
if (a.status === "accepted") color = "green";
if (a.status === "rejected") color = "red";

div.innerHTML = `
  <b>${a.message}</b><br>
  Status: <strong style="color:${color}">${a.status}</strong><br>
  ${a.notification ? `<em>${a.notification}</em>` : ""}
`;



    myAppointments.appendChild(div);
  });
}

/* =========================
   AUTH + ROLE GUARD
========================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));

  if (!snap.exists() || snap.data().role !== "student") {
    alert("Access denied");
    await signOut(auth);
    return;
  }

  loadTeachers();
  loadMyAppointments(user.uid);

  bookBtn.onclick = async () => {
    const teacherId = teacherSelect.value;
    const message = document.getElementById("message").value;

    if (!teacherId || !message) {
      alert("Fill all fields");
      return;
    }

    // ❌ prevent duplicate pending request
    const q = query(
      collection(db, "appointments"),
      where("studentId", "==", user.uid),
      where("teacherId", "==", teacherId),
      where("status", "==", "pending")
    );

    const existing = await getDocs(q);
    if (!existing.empty) {
      alert("You already have a pending request with this teacher");
      return;
    }

    await addDoc(collection(db, "appointments"), {
      studentId: user.uid,
      studentName: user.email,
      teacherId,
      message,
      status: "pending",
      createdAt: serverTimestamp()
    });

    document.getElementById("message").value = "";
    loadMyAppointments(user.uid);
  };
});
