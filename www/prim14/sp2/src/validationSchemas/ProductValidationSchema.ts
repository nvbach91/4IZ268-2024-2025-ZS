import * as Yup from "yup";

const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .max(255, "Název je příliš dlouhý")
    .trim()
    .required("Zadejte název produktu"),
  price: Yup.number()
    .typeError("Cena musí být číslo")
    .min(0, "Zadejte číslo vyšší než 0")
    .required("Zadejte cenu produktu"),
  imagePath: Yup.string()
    .url("Zadejte platnou URL adresu")
    .required("Zadejte cestu k obrázku"),
  availability: Yup.string().required("Zadejte dostupnost produktu"),
  condition: Yup.string().required("Zadejte stav produktu"),
});

export default productValidationSchema;
