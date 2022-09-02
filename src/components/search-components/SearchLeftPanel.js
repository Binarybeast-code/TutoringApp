import React from "react";
import { Grid } from "@material-ui/core";
import LeftPanelContent from "./SearchLeftPanelContent";

const style = {
  position: "fixed",
};

const SearchLeftPanel = () => {
  return (
    <Grid container spacing={10}>
      <Grid item xs={false} sm={2} />
      <Grid item xs={8}>
        <LeftPanelContent />
      </Grid>
    </Grid>
  );
};

export default SearchLeftPanel;
