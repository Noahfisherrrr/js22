console.log("JS file is connected!");

const tableBody = document.querySelector("#users-table tbody");
const addUserBtn = document.getElementById("addUserBtn");
const userModal = document.getElementById("userModal");
const closeBtn = document.querySelector(".close-btn");
const userForm = document.getElementById("userForm");

let isEditing = false;
let editUserId = null;

// Load users and render table
function loadUsers() {
  fetch("https://borjomi.loremipsum.ge/api/all-users")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const users = data.users || [];

      if (!Array.isArray(users)) {
        console.error("Expected users array but got:", users);
        tableBody.innerHTML = `<tr><td colspan="9">No users found</td></tr>`;
        return;
      }

      tableBody.innerHTML = "";

      users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
          <td>${user.email}</td>
          <td>${user.personal_number}</td>
          <td>${user.phone_number}</td>
          <td>${user.zip_code}</td>
          <td>${user.gender}</td>
          <td>
            <button class="edit-btn" data-id="${user.id}">Edit</button>
            <button class="delete-btn" data-id="${user.id}">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);

        // Edit
        row.querySelector(".edit-btn").addEventListener("click", () => {
          openEditModal(user);
        });

        // Delete
        row.querySelector(".delete-btn").addEventListener("click", () => {
          deleteUser(user.id);
        });
      });
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
      tableBody.innerHTML = `<tr><td colspan="9">Failed to load user data</td></tr>`;
    });
}

// Show modal for new user
addUserBtn.addEventListener("click", () => {
  isEditing = false;
  editUserId = null;
  userForm.reset();
  userModal.style.display = "block";
});

// Close modal
closeBtn.addEventListener("click", () => {
  userModal.style.display = "none";
});

// Close modal on outside click
window.addEventListener("click", (e) => {
  if (e.target === userModal) {
    userModal.style.display = "none";
  }
});

// Close modal on ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    userModal.style.display = "none";
  }
});

// Fill modal for editing
function openEditModal(user) {
  isEditing = true;
  editUserId = user.id;

  document.getElementById("firstName").value = user.first_name;
  document.getElementById("lastName").value = user.last_name;
  document.getElementById("email").value = user.email;
  document.getElementById("personalNumber").value = user.personal_number;
  document.getElementById("phoneNumber").value = user.phone_number;
  document.getElementById("zipCode").value = user.zip_code;
  document.getElementById("gender").value = user.gender;

  userModal.style.display = "block";
}

// Handle form submit (add or edit)
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = userForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = isEditing ? "Saving..." : "Submitting...";

  const newUser = {
    first_name: document.getElementById("firstName").value.trim(),
    last_name: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    personal_number: document.getElementById("personalNumber").value.trim(),
    phone_number: document.getElementById("phoneNumber").value.trim(),
    zip_code: document.getElementById("zipCode").value.trim(),
    gender: document.getElementById("gender").value
  };

  const url = isEditing
    ? `https://borjomi.loremipsum.ge/api/update-user/${editUserId}`
    : "https://borjomi.loremipsum.ge/api/register";

  const method = isEditing ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const result = await response.json();
    console.log(isEditing ? "User updated:" : "User added:", result);

    loadUsers();
    userForm.reset();
    userModal.style.display = "none";
    isEditing = false;
    editUserId = null;
  } catch (error) {
    console.error("Error submitting user:", error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});

// Delete user
async function deleteUser(id) {
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`https://borjomi.loremipsum.ge/api/delete-user/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error(`Delete failed: ${response.status}`);

    console.log("User deleted:", id);
    loadUsers();
  } catch (err) {
    console.error("Error deleting user:", err);
  }
}

// Initial load
loadUsers();
