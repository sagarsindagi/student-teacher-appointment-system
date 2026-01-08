import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const list = document.getElementById("apptList");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const q = query(
    collection(db, "appointments"),
    where("teacherId", "==", user.uid)
  );

  const snap = await getDocs(q);
  list.innerHTML = "";

 snap.forEach((d) => {
  const data = d.data();

  const div = document.createElement("div");
  div.style.border = "1px solid #ccc";
  div.style.padding = "10px";
  div.style.marginBottom = "10px";

  const text = document.createElement("p");
  text.innerText = `${data.studentName}: ${data.message} (${data.status})`;
  div.appendChild(text);

  
  if (data.status === "pending") {
    const acceptBtn = document.createElement("button");
    acceptBtn.innerText = "Accept";

    const rejectBtn = document.createElement("button");
    rejectBtn.innerText = "Reject";

    acceptBtn.onclick = async () => {
      await updateDoc(doc(db, "appointments", d.id), {
  status: "accepted",
  notification: "Your appointment was accepted by the teacher"
});

      location.reload();
    };

    rejectBtn.onclick = async () => {
      await updateDoc(doc(db, "appointments", d.id), {
  status: "rejected",
  notification: "Your appointment was rejected by the teacher"
});
      location.reload();
    };

    div.appendChild(acceptBtn);
    div.appendChild(rejectBtn);
  }

  list.appendChild(div);
});

});

document.getElementById("logoutBtn").onclick = () => signOut(auth);
