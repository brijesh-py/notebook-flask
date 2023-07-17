const modelOpenBtn = document.querySelector("#model-open");
const modelCloseBtn = document.querySelector("#model-close");
const model = document.querySelector("#note-book-modal");
const showNotebooks = document.querySelector("#show-notebooks");
const refreshBtn = document.querySelector("#refresh-btn");
const newNotebookBtn = document.querySelector("#new-notebook-btn");
const updateNotebookBtn = document.querySelector("#update-notebook-btn");
const searchNotebooksInput = document.querySelector("#search-notebook");

modelOpenBtn.addEventListener("click", () => {
  model.classList.remove("hidden");
  updateNotebookBtn.disabled = true;
  document.querySelector("#new-notebook-title").value = "";
  document.querySelector("#new-notebook-content").innerHTML = "";
});

modelCloseBtn.addEventListener("click", () => {
  model.classList.add("hidden");
});

refreshBtn.addEventListener("click", () => {
  refreshBtn.classList.add("refresh");
  getNotebooks();
});

const showNotebooksOutput = (data) => {
  showNotebooks.innerHTML = "";
  if (typeof data === "object" && data != "Notebook not found") {
    for (x in data) {
      let notebook = document.createElement("div");
      notebook.setAttribute(
        "class",
        "w3-card w3-padding w3-white w3-round w3-margin-bottom notebook"
      );
      notebook.dataset.id = data[x].id;
      const NotebookMore = `<div class="bar-popup w3-end" data-id="${data[x].id}">
    <ion-icon
      name="ellipsis-vertical-outline"
      class="bar-btn w3-right"
      title="More"
    ></ion-icon>
    <div class="w3-card w3-padding-small w3-round hidden">
      <ion-icon name="trash-outline" class="w3-text-red delete-notebook" title="Delete"></ion-icon><br/>
      <ion-icon name="create-outline" class="w3-text-blue update-notebook" title="Update"></ion-icon>
    </div>
  </div>`;
      notebook.innerHTML = `${NotebookMore}<h4 class="note-book-title" title="Notebook Title"><b>${data[x].note_book_title}</b></h4>
    <div class="note-book-content" title="Notebook Content">${data[x].note_book_content}</div><em class="w3-text-grey" title="Time Line">${data[x].create_at}</em>`;
      showNotebooks.appendChild(notebook);
    }
  }
};

const getNotebooks = () => {
  fetch("http://127.0.0.1:5000/notebooks/")
    .then((res) => res.json())
    .then((data) => {
      showNotebooksOutput(data);
    })
    .finally(() => {
      refreshBtn.classList.remove("refresh");
      NotebookMoreBtn();
    });
};
getNotebooks();

const addNotebook = () => {
  const newNotebookTitle = document.querySelector("#new-notebook-title");
  const newNotebookContent = document.querySelector("#new-notebook-content");
  if (newNotebookTitle.value != "" && newNotebookContent.innerHTML != "") {
    fetch("http://127.0.0.1:5000/notebooks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_book_title: newNotebookTitle.value,
        note_book_content: newNotebookContent.innerHTML,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        getNotebooks();
      })
      .finally(() => {
        newNotebookTitle.value = "";
        newNotebookContent.value = "";
      });
  }
};
newNotebookBtn.disabled = false;
newNotebookBtn.addEventListener("click", addNotebook);

const updateNotebook = () => {
  const updateNotebookTitle = document.querySelector("#new-notebook-title");
  const updateNotebookContent = document.querySelector("#new-notebook-content");
  fetch("http://127.0.0.1:5000/notebooks/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: model.dataset.id,
      note_book_title: updateNotebookTitle.value,
      note_book_content: updateNotebookContent.innerHTML,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      getNotebooks();
    })
    .finally(() => {
      updateNotebookTitle.value = "";
      updateNotebookContent.innerHTML = "";
    });
};
updateNotebookBtn.addEventListener("click", updateNotebook);

const deleteNotebook = (id) => {
  fetch(`http://127.0.0.1:5000/notebooks/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // getNotebooks();
    });
};
const NotebookMoreBtn = () => {
  const bars = document.querySelectorAll(".bar-btn");
  bars.forEach((ele) => {
    ele.addEventListener("click", () => {
      ele.parentElement.querySelector("div").classList.toggle("hidden");
    });
  });
  const deleteBtns = document.querySelectorAll(".delete-notebook");
  deleteBtns.forEach((ele) => {
    ele.addEventListener("click", () => {
      deleteNotebook(ele.parentElement.parentElement.dataset.id);
      ele.parentElement.parentElement.parentElement.remove();
    });
  });
  const updateBtns = document.querySelectorAll(".update-notebook");
  updateBtns.forEach((ele) => {
    ele.addEventListener("click", () => {
      newNotebookBtn.disabled = true;
      updateNotebookBtn.disabled = false;
      model.classList.remove("hidden");
      model.dataset.id = ele.parentElement.parentElement.dataset.id;
      model.querySelector("#new-notebook-title").value =
        ele.parentElement.parentElement.parentElement.querySelector(
          "h4"
        ).innerText;
      model.querySelector("#new-notebook-content").innerHTML =
        ele.parentElement.parentElement.parentElement.querySelector(
          ".note-book-content"
        ).innerHTML;
    });
  });
};

const searchNotebooks = (query) => {
  fetch(`http://127.0.0.1:5000/notebooks/search/${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      showNotebooksOutput(data);
    })
    .finally(() => {
      refreshBtn.classList.remove("refresh");
      NotebookMoreBtn();
    });
};
searchNotebooksInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    refreshBtn.classList.add("refresh");
    searchNotebooks(searchNotebooksInput.value);
  }
});
