"use client";

import { useEffect, useState } from "react";
import "./adminProductContent.css";
import IProduct from "@/models/IProduct";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Formik, Form, FormikProps, ErrorMessage } from "formik";
import productValidationSchema from "@/validationSchemas/ProductValidationSchema";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useAvailabilityLookups from "@/hooks/useAvailabilityLookups";
import useConditionLookups from "@/hooks/useConditionLookups";
import { Skeleton } from "../ui/skeleton";
import useFetch from "@/hooks/useFetch";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "@/services/productsService";
import { Spinner } from "../shared/spinner";

export default function AdminProductContent() {
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [product, setProduct] = useState<IProduct>();
  const [loading, setIsLoading] = useState(
    searchParams.get("id") ? true : false
  );

  const router = useRouter();
  const { sendRequest, sendAuditableRequest } = useFetch();
  const { availabilities } = useAvailabilityLookups();
  const { conditions } = useConditionLookups();

  const initialValues: IProduct = product || {
    name: "",
    price: 0,
    imagePath: "",
    availability: "",
    condition: "",
  };

  const handleSubmit = async (values: IProduct) => {
    const request = product ? updateProduct : createProduct;

    const res = await sendAuditableRequest(request, values);
    if (res.success) {
      router.push("/admin");
    }
  };

  const fetchProduct = async (id: string) => {
    const res = await sendRequest(getProductById, id);
    if (res.success) {
      setProduct({
        _id: res.data._id,
        name: res.data.name,
        price: res.data.price,
        imagePath: res.data.imagePath,
        availability: res.data.availability,
        condition: res.data.condition,
      });
      setTitle(`Úprava produktu ${res.data.name}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const productId = searchParams.get("id");
    if (productId && conditions && availabilities) {
      fetchProduct(productId);
    } else {
      setTitle("Nový produkt");
    }
  }, [searchParams, conditions, availabilities]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="admin-product">
      <h3 className="pb-8">{title}</h3>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={productValidationSchema}
        enableReinitialize
      >
        {(props: FormikProps<IProduct>) => (
          <Form>
            <div className="admin-product__content">
              <div className="admin-product__content__col">
                <div>
                  <Label htmlFor="name">Název produktu</Label>
                  <Input
                    placeholder="Název"
                    id="name"
                    name="name"
                    value={props.values.name}
                    onChange={props.handleChange}
                  />
                  <ErrorMessage name="name" />
                </div>
                <div>
                  <Label htmlFor="price">Cena produktu</Label>
                  <Input
                    placeholder="Cena"
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={props.values.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      props.setFieldValue(
                        "price",
                        value === "" ? "" : parseFloat(value)
                      );
                    }}
                  />
                  <ErrorMessage name="price" />
                </div>
                <div>
                  <Label htmlFor="imagePath">Cesta k obrázku</Label>
                  <Input
                    placeholder="https://domena.cz/obrazek.jpg"
                    id="imagePath"
                    name="imagePath"
                    value={props.values.imagePath}
                    onChange={props.handleChange}
                  />
                  <ErrorMessage name="imagePath" />
                </div>
              </div>
              <div className="admin-product__content__col">
                <div>
                  <Label htmlFor="imagePath">Dostupnost</Label>
                  {availabilities ? (
                    <Select
                      value={props.values.availability}
                      onValueChange={(val) =>
                        props.setFieldValue("availability", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Dostupnost" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availabilities.map((lookup) => (
                            <SelectItem key={lookup._id} value={lookup._id}>
                              {lookup.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Skeleton className="h-10 w-full rounded-md" />
                  )}
                  <ErrorMessage name="availability" />
                </div>
                <div>
                  <Label htmlFor="imagePath">Dostupnost</Label>
                  {conditions ? (
                    <Select
                      value={props.values.condition}
                      onValueChange={(val) =>
                        props.setFieldValue("condition", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Stav zboží" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {conditions.map((lookup) => (
                            <SelectItem key={lookup._id} value={lookup._id}>
                              {lookup.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Skeleton className="h-10 w-full rounded-md" />
                  )}
                  <ErrorMessage name="condition" />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end mt-6 gap-3">
              <Button type="submit" className="px-10">
                Uložit
              </Button>
              <Button
                type="button"
                className="px-10"
                onClick={() => router.back()}
              >
                Zpět
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
