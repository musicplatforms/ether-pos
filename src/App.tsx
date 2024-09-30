import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";

interface Block {
  id: number;
  blockNumber: number;
  blockHeader: string;
  blockCreator: string;
  blockTime: number;
}

function App() {
  const [blocks, setBlocks] = useLocalStorageState<Block[]>("blocks", {
    defaultValue: [],
  });

  useEffect(() => {
    // Create initial 10 blocks if they don't exist
    if (blocks.length === 0) {
      const initialBlocks: Block[] = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        blockNumber: i,
        blockHeader: `0x${(i * 1000).toString(16).padStart(8, '0')}`,
        blockCreator: `0x${(i * 1000 + 1).toString(16).padStart(40, '0')}`,
        blockTime: Date.now() - (10 - i) * 2000,
      }));
      setBlocks(initialBlocks);
    }

    const timer = setInterval(() => {
      addNewBlock();
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const addNewBlock = () => {
    setBlocks((prevBlocks) => {
      const newBlock: Block = {
        id: Date.now(),
        blockNumber: prevBlocks.length,
        blockHeader: `0x${Math.random().toString(16).substr(2, 8)}`,
        blockCreator: `0x${Math.random().toString(16).substr(2, 40)}`,
        blockTime: Date.now(),
      };
      return [...prevBlocks, newBlock];
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Ethereum Proof of Stake Blockchain Visualization
      </Typography>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          padding: '1rem',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '4px',
          },
        }}
      >
        {blocks.map((block) => (
          <Paper
            key={block.id}
            elevation={3}
            sx={{
              minWidth: '200px',
              margin: '0 1rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                padding: '0.5rem',
                textAlign: 'center',
              }}
            >
              <Typography variant="subtitle1">Block {block.blockNumber}</Typography>
            </Box>
            <Box sx={{ padding: '1rem' }}>
              <Typography variant="body2">Header: {block.blockHeader}</Typography>
              <Typography variant="body2">Creator: {block.blockCreator}</Typography>
              <Typography variant="body2">
                Time: {new Date(block.blockTime).toLocaleTimeString()}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}

export default App;

