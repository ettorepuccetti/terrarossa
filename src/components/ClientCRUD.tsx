import { type Client } from "@prisma/client";
import { useState } from "react"
import { api } from "~/utils/api";

export default function ClientCRUD() {
  const utils = api.useContext();

  const clientQuery = api.clients.getAll.useQuery();

  const clientMutationAdd = api.clients.insertOne.useMutation({
    async onSuccess() {
      await utils.clients.invalidate()
    },
  })

  const clientMutationDelete = api.clients.deleteOne.useMutation({
    async onSuccess() {
      await utils.clients.invalidate()
    },
  })

  function sendToDB(client: Client) {
    clientMutationAdd.mutate(client);
  }

  function deleteClient(id: number) {
    clientMutationDelete.mutate(id);
  }

  const emptyClient: Client = { id: -1, name: "", premium: false };
  const [client, setClient] = useState<Client>(emptyClient);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const name: string = event.currentTarget.name;
    const value = event.currentTarget.value;
    setClient(values => ({ ...values, [name]: value }))
  }

  const handleCheckboxChange = () => {
    setClient(values => ({ ...values, premium: !values.premium }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendToDB(client);
    console.log(client);
    setClient(emptyClient);
  }



  return (
    <>
      <ul>
        {clientQuery.data?.map((client: Client) => {
          return (
            <>
              <li key={client.id}>
                <p>
                  name: {client.name}
                  <br />
                  premium: {client.premium ? "yes" : "no"}
                  <br />
                </p>
              </li>
              <button onClick={() => deleteClient(client.id)}>Delete</button>
            </>
          )
        })}
      </ul>
      <form className="form" onSubmit={(event) => handleSubmit(event)}>
        <label>{"Name: "}
          <input
            type="text"
            name={Object.keys(client)[1]}
            value={client.name || ""}
            onChange={(event) => handleChange(event)}
          />
        </label>
        <label>Premium:
          <input
            type="checkbox"
            name={Object.keys(client)[2]}
            value="premium"
            checked={client.premium || false}
            onChange={() => handleCheckboxChange()}
          />
        </label>
        <input className="submit" type="submit" />
      </form>
    </>
  )
}
