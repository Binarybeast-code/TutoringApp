import React from "react";
import { Grid } from "@material-ui/core";
import SearchContent from "./SearchContent";
import SearchLeftPanel from "../../components/search-components/SearchLeftPanel";

const SearchMain = () => {
  return (
    <div>
      <Grid container direction="column">
        <Grid item container>
          <Grid item xs={false} sm={3}>
            {/*Add margin to the left panel */}
            <SearchLeftPanel />
          </Grid>
          <Grid item xs={12} sm={9}>
            {/*if the window size is extra small, this component will take up all of the available space */}
            <SearchContent />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchMain;
