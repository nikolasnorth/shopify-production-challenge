import styles from "../../styles/base.module.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { apiCreateItem } from "../../repo/api/items";
import { City, HttpError } from "../../lib/types";
import { GetServerSidePropsResult } from "next";
import { apiGetCities } from "../../repo/api/cities";

interface Props {
  cities: City[];
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<Props>> {
  try {
    const cities = await apiGetCities();
    return { props: { cities } };
  } catch (e) {
    console.error(e);
    return { props: { cities: [] } };
  }
}


export default function NewItemPage(props: Props) {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);
  const [cityId, setCityId] = useState(1);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!itemName) {
      alert("Item name is required.");
      return;
    }
    if (!cityId) {
      alert("City ID is required.");
      return;
    }
    try {
      await apiCreateItem({ name: itemName, quantity: itemQuantity, cityId });
      await router.push("/");
    } catch (e) {
      if (e instanceof HttpError || e instanceof Error) {
        alert(`Oops! Something went wrong. Error: ${e.message}`);
      }
      console.error(e);
    }
  }

  return (
    <div className={styles["container"]}>
      <Link href="/">
        <h1 className={styles["titleLink"]}>Inventory Management</h1>
      </Link>
      <h2>Create Item</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="itemName">Name</label>
          <br/>
          <input name="itemName" type="text" onChange={event => setItemName(event.target.value)}/>
        </div>
        <div>
          <label htmlFor="itemQuantity">Quantity</label>
          <br/>
          <input name="itemQuantity" type="number" onChange={event => setItemQuantity(Number(event.target.value))}
                 defaultValue={0}/>
        </div>
        <div>
          <label htmlFor="itemCityId">City</label>
          <br/>
          <select name="itemCityId" onChange={event => setCityId(Number(event.target.value))}>
            {props.cities && props.cities.map(city => (<option key={city.id} value={city.id}>{city.name}</option>))}
          </select>
        </div>
        <input type="submit" value="Create"/>
      </form>
    </div>
  );
}
