export const checkAddProduct = (datas) => {
  let errorMessage = [];
  const errorClass = "border-red-500";
  const name = datas.get("name");
  const price = datas.get("price");
  const discount = datas.get("discount");
  const status = datas.get("status");
  const description = datas.get("description");
  const category = datas.get("category");
  const metaTitle = datas.get("metaTitle");
  const metaDescription = datas.get("metaDescription");
  const images = datas.getAll("images");
  const altDescriptions = JSON.parse(datas.get("altDescriptions"));

  document.getElementById("name").classList.remove(errorClass);
  document.getElementById("price").classList.remove(errorClass);
  document.getElementById("discount").classList.remove(errorClass);
  document.getElementById("status").classList.remove(errorClass);
  document.getElementById("description").classList.remove(errorClass);
  document.getElementById("category").classList.remove(errorClass);
  document.getElementById("metaTitle").classList.remove(errorClass);
  document.getElementById("metaDescription").classList.remove(errorClass);
  document.getElementById("images").classList.remove(errorClass);

  if (name.trim() === "") {
    errorMessage.push("Le nom du produit est obligatoire");
    document.getElementById("name").classList.add(errorClass);
  }

  if (!price || isNaN(price) || price <= 0) {
    errorMessage.push(
      "Le prix du produit est obligatoire et doit être supérieur à 0",
    );
    document.getElementById("price").classList.add(errorClass);
  }

  if (discount === null || isNaN(discount) || discount < -100 || discount > 0) {
    errorMessage.push(
      "La réduction doit être un nombre compris entre -100 et 0",
    );
    document.getElementById("discount").classList.add(errorClass);
  }

  if (status.trim() === "") {
    errorMessage.push("Le statut du produit est obligatoire");
    document.getElementById("status").classList.add(errorClass);
  }

  if (description.trim() === "") {
    errorMessage.push("La description du produit est obligatoire");
    document.getElementById("description").classList.add(errorClass);
  }

  if (category.trim() === "") {
    errorMessage.push("La catégorie du produit est obligatoire");
    document.getElementById("category").classList.add(errorClass);
  }

  if (metaTitle.trim() === "") {
    errorMessage.push("Le meta title est obligatoire");
    document.getElementById("metaTitle").classList.add(errorClass);
  }

  if (metaDescription.trim() === "") {
    errorMessage.push("La meta description est obligatoire");
    document.getElementById("metaDescription").classList.add(errorClass);
  }

  if (images.length === 0) {
    errorMessage.push("Au moins une image est obligatoire");
    document.getElementById("images").classList.add(errorClass);
  }

  altDescriptions.forEach((alt, index) => {
    const altFieldId = `altDescription${index}`;
    document.getElementById(altFieldId).classList.remove(errorClass);
    if (alt.trim() === "") {
      errorMessage.push(
        `La description alternative pour l'image ${index + 1} est obligatoire`,
      );
      document.getElementById(altFieldId).classList.add(errorClass);
    }
  });

  return errorMessage;
};
