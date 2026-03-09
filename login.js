console.log("Login functionality ready...");

document.getElementById("login-btn").addEventListener("click", function () {
  const username = document.getElementById("input-username").value.trim();
  const password = document.getElementById("input-password").value.trim();

  const demoUser = "admin";
  const demoPass = "admin123";

  if (username === demoUser && password === demoPass) {
    alert("Login Success ✅");
    window.location.assign("index.html");
  } else {
    alert("Login Failed ❌");
  }
});
