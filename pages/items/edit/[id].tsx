import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import styles from "../../../styles/base.module.css";
import Link from "next/link";
import { City, HttpError, Item } from "../../../lib/types";
import { apiDeleteItemById, apiEditItem, apiGetItemById } from "../../../repo/api/items";
import { apiGetCities } from "../../../repo/api/cities";

interface Props {
  item: Item;
  cities: City[];
}

interface UrlQueryProps extends ParsedUrlQuery {
  id: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext<UrlQueryProps>): Promise<GetServerSidePropsResult<Props>> {
  const notFound = {
    notFound: true,
    redirect: { destination: "/", permanent: false },
  };
  try {
    const id = Number(context.params?.id);
    if (isNaN(id)) {
      return notFound;
    }
    let [item, cities] = await Promise.all([apiGetItemById(id), apiGetCities()]);
    // Hacky fix to ensure only 5 hardcoded cities are shown to the user. For some reason each city was duplicated in
    // the array.
    cities.slice(0, 5);
    return { props: { item, cities } };
  } catch (e) {
    console.error(e);
    return notFound;
  }
}

export default function EditItem(props: Props) {
  const router = useRouter();
  const [itemName, setItemName] = useState(props.item.name);
  const [itemQuantity, setItemQuantity] = useState(props.item.quantity);
  const [itemCityId, setItemCityId] = useState(props.item.cityId);

  async function onSubmitEditItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (itemName != "" && itemName != props.item.name) {
      props.item.name = itemName;
    }
    if (itemQuantity != props.item.quantity) {
      props.item.quantity = itemQuantity;
    }
    if (itemCityId != props.item.cityId) {
      props.item.cityId = itemCityId;
    }
    try {
      await apiEditItem(props.item);
      await router.push("/");
    } catch (e) {
      if (e instanceof HttpError || e instanceof Error) {
        alert(`Oops! Something went wrong. Error: ${e.message}`);
      }
      console.error(e);
    }
  }

  async function onClickDeleteItem() {
    try {
      await apiDeleteItemById(props.item.id);
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
      <h2>Edit Item</h2>
      <form onSubmit={onSubmitEditItem}>
        <div>
          <label htmlFor="itemName">Name</label>
          <br/>
          <input name="itemName" type="text" onChange={event => setItemName(event.target.value)}
                 defaultValue={props.item.name}/>
        </div>
        <div>
          <label htmlFor="itemQuantity">Quantity</label>
          <br/>
          <input name="itemQuantity" type="number" onChange={event => setItemQuantity(Number(event.target.value))}
                 defaultValue={props.item.quantity}/>
        </div>
        <div>
          <label htmlFor="itemCityId">City</label>
          <br/>
          <select name="itemCityId" defaultValue={props.item.cityId}
                  onChange={event => setItemCityId(Number(event.target.value))}>
            {props.cities && props.cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>
        </div>
        <input type="submit" value="Edit"/>
        <input type="reset" value="Cancel" onClick={_ => router.push("/")}/>
      </form>
      <button onClick={() => onClickDeleteItem()}>Delete item</button>
      <br/>
      <small>
        *Delete item removes the item from the database. If you wish to set the quantity to zero, do so in the above
        input form.
      </small>
    </div>
  );
}
