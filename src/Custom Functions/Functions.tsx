//Funtion to convert string to html
export const ConvertStringToHTML = function (str: string):any {
  var template = document.createElement("template");
  str = str.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = str;
  return template.content.firstChild;
};
