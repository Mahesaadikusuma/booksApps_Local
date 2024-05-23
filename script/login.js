const formLogin = document.getElementById("formLogin");
const loginKey = "username";

formLogin.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  localStorage.setItem(loginKey, username);
  console.log(username);

  window.location.href = "main.html";
});
