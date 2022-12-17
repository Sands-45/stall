//Funtion to convert string to html
export const ConvertStringToHTML = function (str: string): any {
  var template = document.createElement("template");
  str = str.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = str;
  return template.content.firstChild;
};

 //Decrypt
export const decrypt = (salt: any, encoded: any) => {
  const textToChars = (text: any) =>
    text.split("").map((c: any) => c.charCodeAt(0));
  const applySaltToChar = (code: any) =>
    textToChars(salt).reduce((a: any, b: any) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex: any) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode: any) => String.fromCharCode(charCode))
    .join("");
};

////Encrypt
export const crypt = (salt:any, text:any) => {
  const textToChars = (text:any) =>
    text.split("").map((c:any) => c.charCodeAt(0));
  const byteHex = (n:any) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code:any) =>
    textToChars(salt).reduce((a:any, b:any) => a ^ b, code);
  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

export const getCurrentDateInput = () => {

  const dateObj = new Date();

  // get the month in this format of 04, the same for months
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObj.getDate()).slice(-2);
  const year = dateObj.getFullYear();

  const shortDate = `${year}-${month}-${day}`;

  return shortDate;
}