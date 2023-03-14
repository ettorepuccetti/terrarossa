import { type Item } from "@prisma/client";
import { useState } from "react"
import { api } from "~/utils/api";
import { z } from "zod";

export const ItemSchema = z.object({
  name: z.string(),
  property: z.boolean(),
  date: z.date().nullish(),
});

type ItemSchemaType = z.infer<typeof ItemSchema>;

export default function ItemCRUD() {
  const utils = api.useContext();

  const itemQuery = api.items.getAll.useQuery();

  const itemMutationAdd = api.items.insertOne.useMutation({
    async onSuccess() {
      await utils.items.invalidate()
    },
  })

  const itemMutationDelete = api.items.deleteOne.useMutation({
    async onSuccess() {
      await utils.items.invalidate()
    },
  })

  function addToDB(item: ItemSchemaType) {
    itemMutationAdd.mutate(item);
  }

  function deleteItem(id: number) {
    itemMutationDelete.mutate(id);
  }

  const emptyItem: ItemSchemaType = { name: "", property: false, date: new Date() };
  const [item, setItem] = useState<ItemSchemaType>(emptyItem);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const name: string = event.currentTarget.name;
    const value = event.currentTarget.value;
    setItem(values => ({ ...values, [name]: value }))
  }

  const handleCheckboxChange = () => {
    setItem(values => ({ ...values, property: !values.property }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addToDB(item);
    console.log(item);
    setItem(emptyItem);
  }

  return (
    <>
      <ul>
        {itemQuery.data?.map((client: Item) => {
          return (
            <>
              <li key={client.id}>
                <p>
                  name: {client.name}
                  <br />
                  property: {client.property ? "yes" : "no"}
                  <br />
                </p>
              </li>
              <button onClick={() => deleteItem(client.id)}>Delete</button>
            </>
          )
        })}
      </ul>
      <form className="form" onSubmit={(event) => handleSubmit(event)}>
        <label>{"Name: "}
          <input
            type="text"
            name={Object.keys(item)[1]}
            value={item.name || ""}
            onChange={(event) => handleChange(event)}
          />
        </label>
        <label>Premium:
          <input
            type="checkbox"
            name={Object.keys(item)[2]}
            value="property"
            checked={item.property || false}
            onChange={() => handleCheckboxChange()}
          />
        </label>
        <input className="submit" type="submit" />
      </form>
    </>
  )
}
