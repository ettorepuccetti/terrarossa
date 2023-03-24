import { useState } from "react"
import { useSession } from "next-auth/react";

export default function ItemCRUD() {

  const [item, setItem] = useState({userId: ""});

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const name: string = event.currentTarget.name;
    const value = event.currentTarget.value;
    setItem(values => ({ ...values, [name]: value }))
  }

  const handleCheckboxChange = () => {
    setItem(values => ({ ...values }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(item);
    setItem({userId: ""});
  }

  const { data: sessionData } = useSession();

  return (
    <>
      <button
        hidden={((sessionData?.user.role === "ADMIN" || sessionData?.user.id === item.userId)) ? false : true}
      >
        Delete
      </button>

      <form className="form" onSubmit={(event) => handleSubmit(event)}>
        <label>{"Name: "}
          <input
            type="text"
            name={Object.keys(item)[0]}
            // value={item.name || ""}
            onChange={(event) => handleChange(event)}
          />
        </label>
        <label>Premium:
          <input
            type="checkbox"
            name={Object.keys(item)[1]}
            value="property"
            // checked={item.property || false}
            onChange={() => handleCheckboxChange()}
          />
        </label>
        <input className="submit" type="submit" />
      </form>
    </>
  )
}
