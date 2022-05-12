import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import styles from "../../../styles/base.module.css";
import Link from "next/link";
import { Item } from "../../../lib/types";
import { apiDeleteItemById, apiEditItem, apiGetItemById } from "../../../repo/api/items";

interface Props {
  item: Item;
}

interface UrlQueryProps extends ParsedUrlQuery {
  id: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext<UrlQueryProps>): Promise<GetServerSidePropsResult<Props>> {
  const notFound = {
    notFound: true,
    redirect: { destination: "/", permanent: false },
  };
  if (!context.params?.id) {
    return notFound;
  }
  const id = Number(context.params.id);

  const result = await apiGetItemById(id);
  if (!result.ok) {
    return notFound;
  }

  return { props: { item: result.value } };
}

export default function EditItem(props: Props) {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);

  async function onSubmitEditItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Prevent name from being an empty string
    if (itemName) {
      props.item.name = itemName;
    }
    props.item.quantity = itemQuantity;
    const result = await apiEditItem(props.item);
    if (!result.ok) {
      alert(`Oops! Something went wrong. Error: ${result.error.message}`);
      return;
    }

    router.push("/");
  }

  async function onClickDeleteItem() {
    const isDeleted = await apiDeleteItemById(props.item.id);
    if (!isDeleted) {
      alert("Oops! We could not delete the item at this time. Please try again later.");
    } else {
      router.push("/");
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
          <label htmlFor="itemName">Name</label><br/>
          <input name="itemName" type="text" onChange={event => setItemName(event.target.value)}
                 defaultValue={props.item.name}/>
        </div>
        <div>
          <label htmlFor="itemQuantity">Quantity</label><br/>
          <input name="itemQuantity" type="number" onChange={event => setItemQuantity(Number(event.target.value))}
                 defaultValue={props.item.quantity}/>
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
