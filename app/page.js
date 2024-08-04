'use client'
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, getDocs, query, doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [img, setImg] = useState();

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

 

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height='100vh'
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      px={2}
    >


      <Modal
        open={open} onClose={handleClose}
      >
        <Box
          position="absolute"
          top="50%" left="50%"
          width={{ xs: '90%', sm: 400 }}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2} display='flex' justifyContent='center' alignItems="center" mb={2}>
            <TextField
              label="Add Item"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              style={{ maxWidth: '400px' }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              style={{ height: '56px' }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      

      <Button
        variant="contained"
        onClick={() => handleOpen()}
      >
        Add new Item
      </Button>

      {/* Search field */}
      <Stack width="100%" direction="row" spacing={2} display='flex' justifyContent='center' alignItems="center" mb={2}>
        <TextField
          label="Search Items"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          style={{ maxWidth: '400px' }}
        />
        <Button
          variant="outlined"
          onClick={() => setSearchQuery('')}
          style={{ height: '56px' }}
        >
          Clear
        </Button>
      </Stack>

      <Box border='1px solid #333' width="100%" maxWidth="800px">
        <Box width='100%' height="100px" bgcolor='#ADD8E6' alignItems="center" justifyContent='center' display='flex'>
          <Typography variant="h3" color="#333">
            Inventory
          </Typography>
        </Box>

        <Stack width='100%' height='300px' spacing={2} overflow='auto'>
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box key={name} width='100%' height='150px' display='flex' justifyContent='space-between' alignItems='center' color="#f0f0f0"
                padding={3}
                flexDirection={{ xs: 'column', sm: 'row' }}
                textAlign="center"
              >
                <Typography variant="h5" color="#333" flex="1">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h5" color="#333" flex="1">
                  {quantity}
                </Typography>
                <Stack direction='row' spacing={2} flex="1" justifyContent="center">
                  <Button variant="contained" onClick={() => {
                    addItem(name);
                  }}>Add</Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'darkred',
                      '&:hover': {
                        backgroundColor: 'red',
                      },
                    }}
                    onClick={() => {
                      removeItem(name);
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  );
}
