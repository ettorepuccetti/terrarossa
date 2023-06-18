import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import useDebounce from "~/hooks/UseDebounce";


export default function SearchBar(props: { onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");

  useDebounce(
    () => {
      props.onSearch(searchTerm);
    },
    [searchTerm],
    700
  );

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TextField
      id="search"
      type="search"
      label="Search"
      value={searchTerm}
      onChange={onSearch}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
