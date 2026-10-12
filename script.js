const form = document.querySelector("#registration-form");
const successMessage = document.querySelector("#success-message");
const today = new Date();
const todayString = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);
const birthDateInput = document.querySelector("#birth-date");

birthDateInput.max = todayString;

const controls = {
  studentId: document.querySelector("#student-id"),
  fullName: document.querySelector("#full-name"),
  email: document.querySelector("#email"),
  phone: document.querySelector("#phone"),
  birthDate: birthDateInput,
  program: document.querySelector("#program"),
  yearLevel: document.querySelector("#year-level"),
  password: document.querySelector("#password"),
  confirmPassword: document.querySelector("#confirm-password"),
  address: document.querySelector("#address"),
  genderField: document.querySelector("#gender-field"),
  agreement: document.querySelector("#agreement"),
};

function showError(control, message) {
  const errorElement = document.querySelector(`#${control.id}-error`);
  control.classList.add("error");
  control.setAttribute("aria-invalid", "true");
  if (errorElement) {
    errorElement.textContent = message;
  }
  if (control.id === "agreement") {
    document.querySelector(".agreement-field").classList.add("error");
  }
}

function clearError(control) {
  const errorElement = document.querySelector(`#${control.id}-error`);
  control.classList.remove("error");
  control.removeAttribute("aria-invalid");
  if (errorElement) {
    errorElement.textContent = "";
  }
  if (control.id === "agreement") {
    document.querySelector(".agreement-field").classList.remove("error");
  }
}

function getValue(control) {
  const value = control.value.trim();
  if (control.value !== value) {
    control.value = value;
  }
  return value;
}

function validateRequired(control) {
  const value = getValue(control);
  if (!value) {
    showError(control, control.dataset.errorRequired);
    return false;
  }
  clearError(control);
  return true;
}

function isControlValid(control) {
  const value = getValue(control);
  switch (control.id) {
    case "student-id":
      return /^[A-Za-z0-9-]{3,20}$/.test(value);
    case "full-name":
      return value.length >= 2;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    case "phone": {
      const digits = value.replace(/\D/g, "");
      return /^\+?[0-9\s()-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
    }
    case "birth-date":
      return Boolean(value) && value <= todayString;
    case "program":
    case "year-level":
      return Boolean(value);
    case "password":
      return value.length >= 8;
    case "confirm-password":
      return Boolean(value) && value === getValue(controls.password);
    case "address":
      return value.length >= 5;
    case "agreement":
      return control.checked;
    default:
      return Boolean(value);
  }
}

function clearErrorWhenValid(control) {
  if (control.classList.contains("error") && isControlValid(control)) {
    clearError(control);
  }
}

function validateForm() {
  let isValid = true;
  let firstInvalidControl = null;
  const validate = (control, isControlValid) => {
    if (!isControlValid) {
      isValid = false;
      firstInvalidControl ??= control;
    }
  };

  const studentId = getValue(controls.studentId);
  if (!studentId) {
    showError(controls.studentId, controls.studentId.dataset.errorRequired);
    validate(controls.studentId, false);
  } else if (!/^[A-Za-z0-9-]{3,20}$/.test(studentId)) {
    showError(controls.studentId, controls.studentId.dataset.errorInvalid);
    validate(controls.studentId, false);
  } else {
    clearError(controls.studentId);
  }

  const fullName = getValue(controls.fullName);
  if (!fullName) {
    showError(controls.fullName, controls.fullName.dataset.errorRequired);
    validate(controls.fullName, false);
  } else if (fullName.length < 2) {
    showError(controls.fullName, controls.fullName.dataset.errorInvalid);
    validate(controls.fullName, false);
  } else {
    clearError(controls.fullName);
  }

  const email = getValue(controls.email);
  if (!email) {
    showError(controls.email, controls.email.dataset.errorRequired);
    validate(controls.email, false);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    showError(controls.email, controls.email.dataset.errorInvalid);
    validate(controls.email, false);
  } else {
    clearError(controls.email);
  }

  const phone = getValue(controls.phone);
  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone) {
    showError(controls.phone, controls.phone.dataset.errorRequired);
    validate(controls.phone, false);
  } else if (!/^\+?[0-9\s()-]+$/.test(phone) || phoneDigits.length < 10 || phoneDigits.length > 15) {
    showError(controls.phone, controls.phone.dataset.errorInvalid);
    validate(controls.phone, false);
  } else {
    clearError(controls.phone);
  }

  const birthDate = getValue(controls.birthDate);
  if (!birthDate) {
    showError(controls.birthDate, controls.birthDate.dataset.errorRequired);
    validate(controls.birthDate, false);
  } else if (birthDate > todayString) {
    showError(controls.birthDate, controls.birthDate.dataset.errorInvalid);
    validate(controls.birthDate, false);
  } else {
    clearError(controls.birthDate);
  }

  const selectedGender = form.querySelector('input[name="gender"]:checked');
  if (!selectedGender) {
    controls.genderField.classList.add("error");
    document.querySelector("#gender-error").textContent = "Select a gender option.";
    validate(form.querySelector('input[name="gender"]'), false);
  } else {
    controls.genderField.classList.remove("error");
    document.querySelector("#gender-error").textContent = "";
  }

  validate(controls.program, validateRequired(controls.program));
  validate(controls.yearLevel, validateRequired(controls.yearLevel));

  const password = getValue(controls.password);
  if (!password) {
    showError(controls.password, controls.password.dataset.errorRequired);
    validate(controls.password, false);
  } else if (password.length < 8) {
    showError(controls.password, controls.password.dataset.errorInvalid);
    validate(controls.password, false);
  } else {
    clearError(controls.password);
  }

  const confirmPassword = getValue(controls.confirmPassword);
  if (!confirmPassword) {
    showError(controls.confirmPassword, controls.confirmPassword.dataset.errorRequired);
    validate(controls.confirmPassword, false);
  } else if (confirmPassword !== password) {
    showError(controls.confirmPassword, "Passwords do not match.");
    validate(controls.confirmPassword, false);
  } else {
    clearError(controls.confirmPassword);
  }

  const address = getValue(controls.address);
  if (!address) {
    showError(controls.address, controls.address.dataset.errorRequired);
    validate(controls.address, false);
  } else if (address.length < 5) {
    showError(controls.address, controls.address.dataset.errorInvalid);
    validate(controls.address, false);
  } else {
    clearError(controls.address);
  }

  if (!controls.agreement.checked) {
    showError(controls.agreement, "You must agree before submitting the registration.");
    validate(controls.agreement, false);
  } else {
    clearError(controls.agreement);
  }

  return { isValid, firstInvalidControl };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.hidden = true;

  const { isValid, firstInvalidControl } = validateForm();
  if (!isValid) {
    firstInvalidControl.focus();
    return;
  }

  form.querySelectorAll(".error").forEach((element) => {
    element.classList.remove("error");
  });
  form.querySelectorAll("[aria-invalid='true']").forEach((element) => {
    element.removeAttribute("aria-invalid");
  });
  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

form.addEventListener("input", (event) => {
  const control = event.target;
  if (control.matches("input, textarea") && control.name !== "gender") {
    clearErrorWhenValid(control);
    successMessage.hidden = true;
  }

  if (control.name === "gender" && control.checked) {
    controls.genderField.classList.remove("error");
    document.querySelector("#gender-error").textContent = "";
    successMessage.hidden = true;
  }

  if (control.id === "password") {
    clearErrorWhenValid(controls.confirmPassword);
  }

  if (control.id === "confirm-password") {
    clearErrorWhenValid(controls.confirmPassword);
  }

  if (control.id === "agreement") {
    clearErrorWhenValid(controls.agreement);
  }
});

form.addEventListener("change", (event) => {
  const control = event.target;
  if (control.matches("select")) {
    clearErrorWhenValid(control);
    successMessage.hidden = true;
  }
});

form.querySelectorAll("[data-password-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const passwordInput = document.getElementById(button.dataset.passwordTarget);
    const isVisible = passwordInput.type === "password";
    passwordInput.setAttribute("type", isVisible ? "text" : "password");
    button.classList.toggle("is-visible", isVisible);
    button.setAttribute("aria-pressed", String(isVisible));
    button.setAttribute("aria-label", `${isVisible ? "Hide" : "Show"} password`);
    button.textContent = isVisible ? "Hide" : "Show";
  });
});

form.addEventListener("reset", () => {
  window.setTimeout(() => {
    form.querySelectorAll(".error").forEach((element) => {
      element.classList.remove("error");
    });
    form.querySelectorAll("[aria-invalid='true']").forEach((element) => {
      element.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".field-error").forEach((element) => {
      element.textContent = "";
    });
    form.querySelectorAll("[data-password-target]").forEach((button) => {
      const passwordInput = document.getElementById(button.dataset.passwordTarget);
      passwordInput.setAttribute("type", "password");
      button.classList.remove("is-visible");
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", "Show password");
      button.textContent = "Show";
    });
    successMessage.hidden = true;
  }, 0);
});
