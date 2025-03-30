export const isAdminRestricted = () => {
  const userEmail = localStorage.getItem("userEmail"); // Get email from localStorage

  if (userEmail === "admin@gmail.com") {
    alert("Admin is not allowed to perform this action.");
    return true; // Return true to indicate restriction
  }

  return false; // No restriction
};
