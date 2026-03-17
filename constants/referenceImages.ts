export const getReferenceImage = (disease?: string) => {
  switch (disease) {
    case "Contact Dermatitis":
      return require("../assets/images/default.png");

    case "Seborrheic Dermatitis":
      return require("../assets/images/default.png");

    case "Psoriasis":
      return require("../assets/images/default.png");

    default:
      return require("../assets/images/default.png");
  }
};
