import {GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import {Item} from "@lib/types";
import {FormEvent, useState} from "react";
import {editItem, getItemById} from "@repo/api/items";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import styles from "@styles/base.module.css";

interface Props {
  item: Item;
}

interface UrlQueryProps extends ParsedUrlQuery {
  id: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext<UrlQueryProps>): Promise<GetServerSidePropsResult<Props>> {
  const notFound = {
    notFound: true,
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
  if (!context.params?.id) {
    return notFound;
  }
  const id = Number(context.params.id);
  const item = await getItemById(id);
  if (!item) {
    return notFound;
  }
  return {
    props: {
      item: item,
    },
  };
}

export default function EditItem(props: Props) {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);

  async function onSubmitEditItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (itemName && itemName != props.item.name) {
      props.item.name = itemName;
    }
    if (itemQuantity && itemQuantity != props.item.quantity) {
      props.item.quantity = itemQuantity;
    }
    const item = await editItem(props.item);
    if (!item) {
      alert("Oops! Something went wrong. Please try again later.");
      return;
    }
    await router.push("/");
  }

  return (
    <div className={styles.container}>
      <h1>Inventory Management</h1>
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
      <button>Delete item</button>
      <br/>
      <small>
        *Delete item removes the item from the database. If you wish to set the quantity to zero, do so in the above
        input form.
      </small>
    </div>
  );
}
