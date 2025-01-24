import {
  DeleteOutlineRounded,
  Send,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
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
import { DeleteDialog } from "./DeleteDialog.jsx";

export function CurrentTodoList() {
  const { currentList, setCurrentList } = useAppState();
  const { data, newItem, deleteItem, toggleChecked, updateItem } =
    useTodoList(currentList);
  const { updateList, deleteList } = useTodoLists();
  const [newItemText, setNewItemText] = useState("");
  const [originalListName, setOriginalListName] = useState("");
  const [originalListItems, setOriginalListItems] = useState({});
  // FIX - delete dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const handleDelete = (id, type) => {
    setTargetToDelete(id);
    setDeleteType(type);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteType === "list") {
      deleteList(targetToDelete);
      setCurrentList(null);
    } else if (deleteType === "item") {
      deleteItem(targetToDelete);
    }
    setIsDialogOpen(false);
    setTargetToDelete(null);
    setDeleteType(null);
  };

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

  const completedCount =
    data?.items?.filter((item) => item.checked).length || 0;
  const unfinishedCount =
    data?.items?.filter((item) => !item.checked).length || 0;

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box sx={{ flex: 1 }}>
        {data ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
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
                <IconButton
                  aria-label="delete list"
                  onClick={() => handleDelete(data.id, "list")}
                >
                  <DeleteOutlineRounded />
                </IconButton>
              </Box>
              {/* FIX - completed/unfinished counts */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckBox fontSize="small" color="success" />
                  <Typography variant="body2" sx={{ ml: 0.5 }} color="success">
                    {completedCount}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckBoxOutlineBlank fontSize="small" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {unfinishedCount}
                  </Typography>
                </Box>
              </Box>
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
                ?.slice()
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // sort by createdAt
                .map(({ id, checked }) => {
                  const labelId = `checkbox-list-label-${id}`;

                  return (
                    <ListItem
                      key={id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(id, "item")}
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
                            fullWidth
                            sx={{ pr: 3 }}
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
                    // FIX - send button
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="submit"
                              onClick={(event) => {
                                event.preventDefault();
                                void newItem(newItemText);
                                setNewItemText("");
                              }}
                            >
                              <Send />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
              </ListItem>
              {/* FIX - DeleteDialog component */}
              <DeleteDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={confirmDelete}
                message={
                  deleteType === "list"
                    ? "Are you sure you want to delete this List? This action cannot be undone."
                    : "Are you sure you want to delete this Item? This action cannot be undone."
                }
              />
            </List>
          </>
        ) : (
          <Typography>No List Selected</Typography>
        )}
      </Box>
    </Box>
  );
}
