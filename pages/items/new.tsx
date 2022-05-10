import styles from "@styles/base.module.css";
import {FormEvent, useState} from "react";
import {createItem} from "@repo/api/items";
import {useRouter} from "next/router";

export default function NewItemPage() {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!itemName) {
      alert("Item name is required.");
      return;
    }
    const item = await createItem({name: itemName, quantity: itemQuantity});
    if (!item) {
      alert("Oops! Something went wrong. Please try again.");
      return;
    }
    await router.push("/");
  }

  return (
    <div className={styles.container}>
      <h1>Inventory Management</h1>
      <h2>Create Item</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="itemName">Name</label><br/>
          <input name="itemName" type="text" onChange={event => setItemName(event.target.value)}/>
        </div>
        <div>
          <label htmlFor="itemQuantity">Quantity</label><br/>
          <input name="itemQuantity" type="number" onChange={event => setItemQuantity(Number(event.target.value))}
                 defaultValue={0}/>
        </div>
        <input type="submit" value="Create"/>
      </form>
    </div>
  );
}
