export const toUpper = (str: string) => {
  let firstChar = str?.charAt(0).toUpperCase();
  let otherPart = str?.split("");
  otherPart?.shift();
  return firstChar + otherPart?.join("")?.toLowerCase();
};

//Email Validation function ============
export const isEmail = (email: any) => {
  return /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);
};

//Funtion to convert string to html
export const ConvertStringToHTML = function (str: string): any {
  var template = document.createElement("template");
  str = str.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = str;
  return template.content.firstChild;
};

//Number Spacing ====
export const numberWithSpaces = (x: any) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};
