import { type Client } from "@prisma/client";
import { useState } from "react"
import { api } from "~/utils/api";

export default function ClientCRUD() {
  const utils = api.useContext();
  const clientQuery = api.clients.getAll.useQuery();

  const clientMutation = api.clients.insertOne.useMutation({
    async onSuccess() {
      await utils.clients.invalidate()
    },
  })

  const emptyClient: Client = { id: -1, Name: "", Premium: false };
  const [client, setClient] = useState<Client>(emptyClient);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const name: string = event.currentTarget.name;
    const value = event.currentTarget.value;
    setClient(values => ({ ...values, [name]: value }))
  }

  const handleCheckboxChange = () => {
    setClient(values => ({ ...values, Premium: !values.Premium }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendToDB(client);
    console.log(client);
    setClient(emptyClient);
  }

  function sendToDB(client: Client) {
    clientMutation.mutate(client);
    // await api.client.getAll.;
  }

  return (
    <>
      <ul>
        {clientQuery.data?.map((client: Client, index: number) => {
          return (
            <li key={index}>
              <p>
                name: {client.Name}
                <br />
                premium: {client.Premium ? "yes" : "no"}
              </p>
            </li>
          )
        })}
      </ul>
      <form className="form" onSubmit={(event) => handleSubmit(event)}>
        <label>{"Name: "}
          <input
            type="text"
            name={Object.keys(client)[1]}
            value={client.Name || ""}
            onChange={(event) => handleChange(event)}
          />
        </label>
        <label>Premium:
          <input
            type="checkbox"
            name={Object.keys(client)[2]}
            value="premium"
            checked={client.Premium || false}
            onChange={() => handleCheckboxChange()}
          />
        </label>
        <input className="submit" type="submit" />
      </form>
    </>
  )
}
