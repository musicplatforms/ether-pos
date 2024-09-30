import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Block {
  id: number;
  blockNumber: number;
  blockHeader: string;
  blockCreator: string;
  blockTime: number;
}

const VISIBLE_BLOCKS = 5;

function App() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (blocks.length === 0) {
      const initialBlocks: Block[] = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        blockNumber: i,
        blockHeader: `0x${Math.random().toString(16).substr(2, 16)}`,
        blockCreator: `0x${Math.random().toString(16).substr(2, 16)}`,
        blockTime: Date.now() - (10 - i) * 8000,
      }));
      setBlocks(initialBlocks);
    }

    let timer: NodeJS.Timeout;
    if (isGenerating) {
      timer = setInterval(() => {
        addNewBlock();
      }, 8000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGenerating, blocks.length]); // Add isGenerating to the dependency array

  const addNewBlock = () => {
    setBlocks((prevBlocks) => {
      const newBlock: Block = {
        id: Date.now(),
        blockNumber: prevBlocks.length,
        blockHeader: `0x${Math.random().toString(16).substr(2, 16)}`,
        blockCreator: `0x${Math.random().toString(16).substr(2, 16)}`,
        blockTime: Date.now(),
      };
      return [...prevBlocks, newBlock];
    });
  };

  useEffect(() => {
    setStartIndex(Math.max(0, blocks.length - VISIBLE_BLOCKS));
  }, [blocks.length]);

  const toggleGeneration = () => {
    setIsGenerating(!isGenerating);
  };

  const showPreviousBlocks = () => {
    setStartIndex((prev) => Math.max(0, prev - VISIBLE_BLOCKS));
  };

  const showNewerBlocks = () => {
    setStartIndex((prev) => Math.min(blocks.length - VISIBLE_BLOCKS, prev + VISIBLE_BLOCKS));
  };

  const columns: GridColDef[] = [
    { field: 'blockNumber', headerName: 'Block Number', width: 130 },
    { field: 'blockHeader', headerName: 'Block Header', width: 200 },
    { field: 'blockCreator', headerName: 'Block Creator', width: 300 },
    { 
      field: 'blockTime', 
      headerName: 'Block Time', 
      width: 200,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
  ];

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" component="h1">
          Ethereum Proof of Stake Blockchain Visualization
        </Typography>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={showPreviousBlocks}
            disabled={startIndex === 0}
          >
            See Previous
          </Button>
          <Button
            variant="contained"
            startIcon={isGenerating ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={toggleGeneration}
          >
            {isGenerating ? 'Stop Generating' : 'Resume Generating'}
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={showNewerBlocks}
            disabled={startIndex >= blocks.length - VISIBLE_BLOCKS}
          >
            See Newer
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: '25vh',
            mb: 2,
          }}
        >
          {blocks.slice(startIndex, startIndex + VISIBLE_BLOCKS).map((block) => (
            <Paper
              key={block.id}
              elevation={3}
              sx={{
                width: `${100 / VISIBLE_BLOCKS}%`,
                mx: 0.5,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  padding: '0.25rem',
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2" noWrap>Block {block.blockNumber}</Typography>
              </Box>
              <Box sx={{ padding: '0.25rem', fontSize: '0.7rem', flexGrow: 1, overflow: 'hidden' }}>
                <Typography variant="body2" noWrap>Header: {block.blockHeader}</Typography>
                <Typography variant="body2" noWrap>Creator: {block.blockCreator}</Typography>
                <Typography variant="body2" noWrap>
                  Time: {new Date(block.blockTime).toLocaleTimeString()}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
        <Typography variant="h5" component="h2" gutterBottom>
          All Blocks
        </Typography>
        <Box sx={{ height: '50vh', width: '100%' }}>
          <DataGrid
            rows={blocks}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;

