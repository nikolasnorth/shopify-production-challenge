import styles from "@styles/base.module.css";
import {GetServerSidePropsResult} from "next";
import {getItems} from "@repo/items";
import {Item} from "@lib/types";
import {useState} from "react";
import {useRouter} from "next/router";
import {createShipment} from "@repo/shipments";

interface Props {
  items: Item[];
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<Props>> {
  const items = await getItems();
  return {
    props: {
      items: items,
    },
  };
}

export default function NewShipmentPage(props: Props) {
  const router = useRouter();
  const [availableItems, setAvailableItems] = useState(props.items.filter(item => item.quantity > 0));
  const [shippingItems, setShippingItems] = useState<Item[]>([]);

  // Adds given item to shipment cart.
  function addItemToShipment(item: Item) {
    // Find index of item
    const i = shippingItems.findIndex(shipmentItem => shipmentItem.id == item.id);
    const j = availableItems.findIndex(availableItem => availableItem.id == item.id);
    if (j == -1) {
      alert("Oops! We could not add this item. Please try again later.");
      return;
    }

    // Make copies of item arrays for state change
    const updatedAvailableItems = [...availableItems];
    const updatedShippingItems = [...shippingItems];

    // Add item to shipment
    if (i == -1) {
      updatedShippingItems.push({id: item.id, name: item.name, quantity: 1});
    } else {
      updatedShippingItems[i].quantity += 1;
    }
    updatedAvailableItems[j].quantity -= 1;
    if (updatedAvailableItems[j].quantity == 0) {
      // Remove item
      updatedAvailableItems.splice(j, 1);
    }

    // Update state
    setAvailableItems(updatedAvailableItems);
    setShippingItems(updatedShippingItems);
  }

  // Removes given item from shipment cart.
  function removeItemFromShipment(item: Item) {
    const i = shippingItems.findIndex(shipmentItem => shipmentItem.id == item.id);
    const j = availableItems.findIndex(availableItem => availableItem.id == item.id);
    if (i == -1) {
      alert("Oops! We could not remove this item. Please try again later.");
      return;
    }

    // Make copies of item arrays for state change
    const updatedAvailableItems = [...availableItems];
    const updatedShippingItems = [...shippingItems];

    // Remove item from shipment
    if (j == -1) {
      updatedAvailableItems.push({id: item.id, name: item.name, quantity: 1});
    } else {
      updatedAvailableItems[j].quantity += 1;
    }
    updatedShippingItems[i].quantity -= 1;
    if (updatedShippingItems[i].quantity == 0) {
      // Remove item
      updatedShippingItems.splice(i, 1);
    }

    // Update state
    setAvailableItems(updatedAvailableItems);
    setShippingItems(updatedShippingItems);
  }

  async function processShipment() {
    if (shippingItems.length == 0) {
      alert("Shipment items cart is empty.");
      return;
    }
    const shipment = await createShipment(shippingItems);
    if (!shipment) {
      alert("Oops! We could not create the shipment at this time. Please try again later.");
    }
    await router.push("/");
  }

  return (
    <div className={styles.container}>
      <h1>Inventory Management</h1>
      <h2>Create Shipment</h2>
      <div className={styles.createShipment}>
        <div className={styles.availableItems}>
          <h3>Available items</h3>
          {
            availableItems.map(item => (
              <div key={item.id} className={styles.itemContainer}>
                <button onClick={() => addItemToShipment(item)}>+</button>
                {item.name}, Quantity: {item.quantity}
              </div>
            ))
          }
        </div>
        <div className={styles.shippingItems}>
          <h3>Shipping Items</h3>
          {
            shippingItems.map(item => (
              <div key={item.id} className={styles.itemContainer}>
                <button onClick={() => removeItemFromShipment(item)}>-</button>
                {item.name}, Quantity: {item.quantity}
              </div>
            ))
          }
          {
            shippingItems.length > 0 && (<button onClick={() => processShipment()}>Process Shipment</button>)
          }
        </div>
      </div>
    </div>
  );
}
