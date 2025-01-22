import * as Icons from "@mui/icons-material";
import { Add } from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import { usePopupState } from "material-ui-popup-state/hooks";

import { NewListDialog } from "./NewListDialog.jsx";
import { useTodoLists } from "../hooks/useTodoLists.js";
import { useAppState } from "../providers/AppState.jsx";

export function AllTodoLists() {
  const { data } = useTodoLists(); // add loading
  const { currentList, setCurrentList } = useAppState();
  const dialogState = usePopupState({ variant: "dialog", popupId: "new-list" });

  useEffect(() => {
    if (!currentList) {
      setCurrentList(data[0]?.id);
    }
  }, [currentList, data, setCurrentList]);

  return (
    <Drawer
      sx={{
        width: 0.25,
        minWidth: 200,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 0.25,
          minWidth: 200,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <NewListDialog dialogState={dialogState} />
      {/*Empty Toolbar for spacing*/}
      <Toolbar />
      <List>
        {data.map(({ name, id, icon }) => {
          const Icon = Icons[icon];
          return (
            <ListItem key={id} disablePadding>
              <ListItemButton
                onClick={() => {
                  setCurrentList(id);
                }}
                selected={currentList === id}
              >
                {Icon ? <Icon /> : <Icons.List />}
                <ListItemText sx={{ ml: 0.5 }} primary={name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Tooltip title="Add new list">
        <IconButton
          disableFocusRipple
          disableRipple
          color="inherit"
          aria-label="add new list button"
          onClick={dialogState.open}
        >
          <Add />
        </IconButton>
      </Tooltip>
    </Drawer>
  );
}
