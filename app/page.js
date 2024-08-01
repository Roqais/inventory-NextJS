'use client'
import Image from "next/image";

import { useState, useEffect } from "react";

import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, getDocs, query, doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(), // Use doc.data() to access the document's data
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
    >
      <Modal
        open={open} onClose={handleClose}
      >
        <Box
          position="absolute"
          top="50%" left="50%"
          width={400}
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
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button variant="outlined" onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}>Add</Button>
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
          style={{ width: '400px' }}
        />
        <Button
          variant="outlined"
          onClick={() => setSearchQuery('')} // Clear search input
          style={{ height: '56px' }} // Matches the height of the TextField
        >
          Clear
        </Button>
      </Stack>


      <Box border='1px solid #333'>
        <Box width='800px' height="100px" bgcolor='#ADD8E6' alignItems="center" justifyContent='center' display='flex'>
          <Typography variant="h3" color="#333">
            Inventory
          </Typography>
        </Box>

        <Stack width='800px' height='300px' spacing={2} overflow='auto'>
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box key={name} width='100%' height='150px' display='flex' justifyContent='space-between' alignItems='center' color="#f0f0f0"
                padding={5}>
                <Typography variant="h3" color="#333" textAlign='center'>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign='center'>
                  {quantity}
                </Typography>
                <Stack direction='row' spacing={2}>
                  <Button variant="contained" onClick={() => {
                    addItem(name);
                  }}>Add</Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'darkred', // Custom background color
                      '&:hover': {
                        backgroundColor: 'red', // Hover effect
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
