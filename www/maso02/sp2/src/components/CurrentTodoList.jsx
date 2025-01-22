import { DeleteOutlineRounded, Send } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useTodoList } from "../hooks/useTodoList.js";
import { useTodoLists } from "../hooks/useTodoLists.js";
import { useAppState } from "../providers/AppState.jsx";

export function CurrentTodoList() {
  const { currentList } = useAppState();
  const { data, newItem, deleteItem, toggleChecked, updateItem } =
    useTodoList(currentList);
  const { updateList } = useTodoLists();
  const [newItemText, setNewItemText] = useState("");
  const [originalListName, setOriginalListName] = useState("");
  const [originalListItems, setOriginalListItems] = useState({});

  useEffect(() => {
    if (data?.name) {
      setOriginalListName(data.name);
    }
  }, [currentList, data?.name]);

  useEffect(() => {
    if (data?.items && data.items.length > 0) {
      const newItemsState = data.items.reduce(
        (acc, { id, name }) => ({ ...acc, [id]: name }),
        {}
      );
      setOriginalListItems((prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(newItemsState)) {
          return newItemsState;
        }
        return prevState;
      });
    }
  }, [data?.items]);

  const Icon = Icons[data?.icon];

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box sx={{ flex: 1 }}>
        {data ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  p: 1,
                  mr: 1,
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                {Icon ? (
                  <Icon fontSize="large" />
                ) : (
                  <Icons.List fontSize="large" />
                )}
              </Box>
              <TextField
                value={originalListName}
                onChange={(event) => {
                  setOriginalListName(event.target.value);
                }}
                onBlur={(event) => {
                  void updateList(data.id, event.target.value);
                }}
              />
            </Box>
            <Divider />
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                mx: "auto",
                mt: 2,
              }}
            >
              {data.items
                ?.slice() // Create a shallow copy to avoid mutating the original array
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by createdAt
                .map(({ id, checked }) => {
                  const labelId = `checkbox-list-label-${id}`;

                  return (
                    <ListItem
                      key={id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteItem(id)}
                        >
                          <DeleteOutlineRounded />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton
                        role={undefined}
                        onClick={() => toggleChecked(id)}
                        dense
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={checked ?? false}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId}>
                          <TextField
                            onClick={(e) => e.stopPropagation()}
                            onChange={(event) => {
                              setOriginalListItems({
                                ...originalListItems,
                                [id]: event.target.value,
                              });
                            }}
                            onBlur={(event) => {
                              void updateItem(id, event.target.value);
                            }}
                            value={originalListItems[id] ?? ""}
                            size="small"
                            variant="standard"
                          />
                        </ListItemText>
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography variant="caption" color="textSecondary">
                            Created on{" "}
                            {data.items.find((item) => item.id === id)
                              ?.createdAt
                              ? new Date(
                                  data.items.find(
                                    (item) => item.id === id
                                  )?.createdAt
                                ).toLocaleDateString("cs-CZ")
                              : "N/A"}{" "}
                            by
                          </Typography>
                          <Tooltip
                            title={
                              data.items.find((item) => item.id === id)
                                ?.createdByEmail || "Unknown"
                            }
                          >
                            <Typography
                              variant="caption"
                              color="primary"
                              sx={{ cursor: "pointer" }}
                            >
                              {data.items.find((item) => item.id === id)
                                ?.createdBy || "Anonymous"}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              <ListItem>
                <Box
                  component="form"
                  sx={{ width: 1 }}
                  onSubmit={(event) => {
                    event.preventDefault();
                    void newItem(newItemText);
                    setNewItemText("");
                  }}
                >
                  <TextField
                    onChange={(event) => {
                      setNewItemText(event.target.value);
                    }}
                    value={newItemText}
                    margin="normal"
                    id="new-item"
                    label="New Item"
                    type="text"
                    fullWidth
                    variant="filled"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="submit"
                            onClick={() => {
                              document.activeElement.blur();
                            }}
                            edge="end"
                          >
                            <Send />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </ListItem>
            </List>
          </>
        ) : (
          <Typography>No List Selected</Typography>
        )}
      </Box>
    </Box>
  );
}
