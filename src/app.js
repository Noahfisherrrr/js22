console.log("JS file is connected!");

const tableBody = document.querySelector("#users-table tbody");

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
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
      tableBody.innerHTML = `<tr><td colspan="9">Failed to load user data</td></tr>`;
    });
}

loadUsers();
