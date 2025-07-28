import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import useDebounce from "~/hooks/UseDebounce";
import { useLogger } from "~/utils/logger";

export default function SearchBar(props: { onSearch: (term: string) => void }) {
  const logger = useLogger({ component: "SearchBar" });
  const [searchTerm, setSearchTerm] = useState("");

  // It listen for changes on `searchTerm`. Every time `searchTerm` changes, we wait 300ms before calling `props.onSearch`
  useDebounce(
    () => {
      logger.info("searching", { searchTerm: searchTerm });
      props.onSearch(searchTerm);
    },
    [searchTerm],
    300,
  );

  const onSearchInternal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TextField
      id="search"
      type="search"
      label="Cerca il tuo circolo"
      value={searchTerm}
      onChange={onSearchInternal}
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
