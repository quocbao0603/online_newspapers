function toggleResetPswd(e) {
  e.preventDefault();
  $("#logreg-forms .form-signin").toggle(); // display:block or none
  $("#logreg-forms .form-reset").toggle(); // display:block or none
}

function toggleSignUp(e) {
  e.preventDefault();
  $("#logreg-forms .form-signin").toggle(); // display:block or none
  $("#logreg-forms .form-signup").toggle(); // display:block or none
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
  }

$(() => {
  // Login Register Form
  $("#logreg-forms #forgot_pswd").click(toggleResetPswd);
  $("#logreg-forms #cancel_reset").click(toggleResetPswd);
  $("#logreg-forms #btn-signup").click(toggleSignUp);
  $("#logreg-forms #cancel_signup").click(toggleSignUp);
});

$("#login-form").on("submit", function (e) {
  e.preventDefault();
  const username = $("#username").val();
  const password = $("#password").val();
  $.getJSON(`/account/is-correct?user=${username}&pw=${password}`, function (data) {
    console.log(data);
    if (data === "Correct") {
      $("#login-form").off("submit").submit();
    } else if (data === "Invalid username!") {
      $("#err_login").html("Tên đăng nhập không tồn tại!");
      $("#err_login").css("display", "block");
    } else {
      $("#err_login").html("Mật khẩu không chính xác!");
      $("#err_login").css("display", "block");
    }
  });
});

$("#signup-form").on("submit", function (e) {
  e.preventDefault();
  const password = $("#password_signup").val();
  const repeat_pass = $("#repeatpass").val();
  const email = $("#email").val();
  if (password !== repeat_pass) {
    $("#err_signup").html("Mật khẩu nhập lại không khớp");
    $("#err_signup").css("display", "block");
  } 
  else if (!validateEmail(email)) {
    $("#err_signup").html("Email không hợp lệ");
    $("#err_signup").css("display", "block");
  } 
  else{
    const username = $("#username_signup").val();
    $.getJSON(`/account/is-available?user=${username}`, function (data) {
      if (data === false) {
        $("#err_signup").html("Tài khoản đã tồn tại");
        $("#err_signup").css("display", "block");
      }
      else{
        $("#signup-form").off("submit").submit();
      }
    });
  }
});
