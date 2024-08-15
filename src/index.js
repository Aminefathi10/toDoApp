import "./style.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp, orderBy, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";


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
const auth = getAuth();
const colRef = collection(db, "tasks");
const currentUser = null;


// sign up function
const signUnForm = document.getElementById("signupForm")
signUnForm.addEventListener("submit", e => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
    .then(cre => console.log(cre.user))
    e.target.reset();
});

// sign in
const signInForm = document.getElementById("signinForm")
signInForm.addEventListener("submit", e => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
    .then(cre => {
        const q = query(colRef, where("uid", "==", cre.user.uid, orderBy("createdAt", "desc")));
        currentUser = re.user.uid;
        onSnapshot(q, snap => {
            let tasks = [];
            snap.docs.forEach(doc => {
                tasks.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            renderTasks(tasks);
        });
    })
    .catch(error => console.log(error))
    e.target.reset();
});

// switch between sign in and out
document.querySelectorAll(".switch").forEach(btn => {
    btn.addEventListener("click", () => {
        signInForm.classList.toggle("hide");
        signUnForm.classList.toggle("hide");
    })
})

// sign out
document.getElementById("signOut")
.addEventListener("click", () => signOut(auth) );

// subscribe to auth state change
onAuthStateChanged(auth, user => {
    if (user) {
        document.getElementById("main").classList.remove("hide");
        document.getElementById("auth").classList.add("hide");
    } else {
        document.getElementById("main").classList.add("hide");
        document.getElementById("auth").classList.remove("hide");
    }
}); 

// get data and render it
onSnapshot(q, snap => {
    let tasks = [];
    snap.docs.forEach(doc => {
        tasks.push({
            id: doc.id,
            ...doc.data()
        });
    });
    renderTasks(tasks);
});

function renderTasks(tasks){
const tasksContainer = document.querySelector(".tasks");
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





// delete task
function deleteTask(id) {
    const tasktobedeleted = doc(db, "tasks", id);
    deleteDoc(tasktobedeleted);
}

// add task
const form = document.getElementById("taskinputform");
form.addEventListener("submit", e => {
    e.preventDefault();
    addDoc(colRef, {
        uid: currentUser,
        task: form["task"].value,
        createdAt: serverTimestamp()
    });
    form.reset();
});

