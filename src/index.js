import "./style.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp, orderBy, query, where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBOw5tluoIwW-sVdxD8-ojrMot-kfEsiro",
    authDomain: "x-clone-react.firebaseapp.com",
    projectId: "x-clone-react",
    storageBucket: "x-clone-react.appspot.com",
    messagingSenderId: "317360485642",
    appId: "1:317360485642:web:d7aaab72ccfc4cb19ff6f3"
  };
initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "tasks");
const q = query(colRef, orderBy("createdAt", "desc"));

const tasksContainer = document.querySelector(".tasks");

function renderTasks(tasks){
    tasksContainer.innerHTML = tasks.map((t, i) => `<div class="task" id="${i}">
    <p>${t.task}</p>
    <button data-id="${t.id}" class="deleteBtn">Delete</button>
    </div>`).join("");
    
    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            deleteTask(id);
        })
    })
}

onSnapshot(q, snap => {
    let tasks = [];
    snap.docs.forEach(doc => {
        tasks.push({
            id: doc.id,
            ...doc.data()
        });
    });
    console.log(tasks)
    renderTasks(tasks);
});

function deleteTask(id) {
    const tasktobedeleted = doc(db, "tasks", id);
    deleteDoc(tasktobedeleted);
}

const form = document.getElementById("myForm");
form.addEventListener("submit", e => {
    e.preventDefault();
    addDoc(colRef, {
        task: form["task"].value,
        createdAt: serverTimestamp()
    });
    form.reset();
});

