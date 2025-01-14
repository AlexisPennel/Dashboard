import { description } from "@/components/Dashboard/Dashboard";

export const checkAddCategory = (datas) => {
  let errorMessage = [];
  const errorClass = "border-red-500";
  const name = datas.get("name");
  const description = datas.get("description");
  const image = datas.getAll("image");
  const altDescription = datas.get("altDescription");
  console.log(image);
  document.getElementById("categoryName").classList.remove(errorClass);
  document.getElementById("description").classList.remove(errorClass);
  document.getElementById("categoryImage").classList.remove(errorClass);
  document.getElementById("altDescription").classList.remove(errorClass);

  if (name.trim() === "") {
    errorMessage.push("Le nom est obligatoire");
    document.getElementById("categoryName").classList.add(errorClass);
  }

  if (description.trim() === "") {
    errorMessage.push("La description est obligatoire");
    document.getElementById("description").classList.add(errorClass);
  }

  // if (image === null) {
  //   errorMessage.push("L'image est obligatoire");
  //   document.getElementById("categoryImage").classList.add(errorClass);
  // }

  if (altDescription === null || altDescription.trim() === "") {
    errorMessage.push("La description alt est obligatoire");
    document.getElementById("altDescription").classList.add(errorClass);
  }

  return errorMessage;
};
