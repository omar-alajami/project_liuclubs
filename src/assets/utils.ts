export function formatAnnouncementDate(isoString: string): string {
  const date = new Date(isoString)
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${dd}/${mm}/${yyyy} · ${time}`
}

export function checkPassword(password: string): string {
  if (password.length < 8 || password.length > 64) {
    return "Password must be between 8 and 64 characters";
  }

  if (password.startsWith(" ") || password.endsWith(" ")) {
    return "Password must not have leading or trailing spaces";
  }

  // Only ASCII letters, numbers, spaces, and standard special characters.
  if (!/^[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/.test(password)) {
    return "Password contains invalid characters";
  }

  if (!/[A-Za-z]/.test(password)) {
    return "Password must contain at least 1 letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least 1 digit";
  }

  if (!/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password)) {
    return "Password must contain at least 1 special character";
  }

  return "";
}
export function checkName(name: string): boolean {
  if (name.trim().replace(/\s+/g, " ").length < 2) return false;
  return /^[A-Za-z '-]+$/.test(name);
}
export function checkMidName(name: string): boolean {
  return /^[A-Za-z .'-]*$/.test(name);
}
export function checkPhone(phone: string): boolean {
  const newPhone = phone.replace(/\s/g, "")
  if (!newPhone) return true;
  if(newPhone.length > 15 || newPhone.length < 7 ) return false;
  return true;
}
export function checkMajor(major: string): boolean {
  if (major.trim() === '') return true;
  if (major.trim().replace(/\s+/g, " ").length < 3) return false;
  return /^[A-Za-z .'-]+$/.test(major);
}
export function checkEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith('liu.edu.lb');
}