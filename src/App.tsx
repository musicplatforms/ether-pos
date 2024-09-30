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
    // Clear previous blocks on reload
    setBlocks([]);

    const initialBlocks: Block[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      blockNumber: i,
      blockHeader: `0x${(i * 1000).toString(16).padStart(8, '0')}`,
      blockCreator: `0x${(i * 1000 + 1).toString(16).padStart(40, '0')}`,
      blockTime: Date.now() - (10 - i) * 8000,
    }));
    setBlocks(initialBlocks);

    let timer: NodeJS.Timeout;
    if (isGenerating) {
      timer = setInterval(() => {
        addNewBlock();
      }, 8000);
    }

    return () => clearInterval(timer);
  }, [isGenerating]);

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
    setStartIndex((prev) => Math.max(prev, blocks.length - VISIBLE_BLOCKS + 1));
  };

  const toggleGeneration = () => {
    setIsGenerating(!isGenerating);
  };

  const showPreviousBlocks = () => {
    setStartIndex((prev) => Math.max(0, prev - VISIBLE_BLOCKS));
  };

  const showNewerBlocks = () => {
    setStartIndex((prev) => Math.min(blocks.length - VISIBLE_BLOCKS, prev + VISIBLE_BLOCKS));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Ethereum Proof of Stake Blockchain Visualization
      </Typography>
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
          overflow: 'hidden',
        }}
      >
        {blocks.slice(startIndex, startIndex + VISIBLE_BLOCKS).map((block) => (
          <Paper
            key={block.id}
            elevation={3}
            sx={{
              width: `${100 / VISIBLE_BLOCKS}%`,
              margin: '0 0.5rem',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
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
              <Typography variant="subtitle2">Block {block.blockNumber}</Typography>
            </Box>
            <Box sx={{ padding: '0.5rem', fontSize: '0.8rem' }}>
              <Typography variant="body2" noWrap>Header: {block.blockHeader}</Typography>
              <Typography variant="body2" noWrap>Creator: {block.blockCreator}</Typography>
              <Typography variant="body2" noWrap>
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

