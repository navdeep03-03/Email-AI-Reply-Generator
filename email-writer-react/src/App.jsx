import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#5b4fd6' },
    secondary: { main: '#8b5cf6' },
    background: { default: '#f4f2ff', paper: '#ffffff' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    subtitle1: { lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 12, paddingInline: 20 },
        sizeLarge: { paddingBlock: 12, fontSize: '1rem' },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
  },
});

function SendIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </SvgIcon>
  );
}

function CopyIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </SvgIcon>
  );
}

function MailOutlineIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </SvgIcon>
  );
}

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySnackbar, setCopySnackbar] = useState(false);

  const canSubmit = Boolean(emailContent.trim()) && !loading;

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault?.();
    const trimmed = emailContent.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8081/api/email/generate', {
        emailContent: trimmed,
        tone: tone || undefined,
      });
      const data = response.data;
      setGeneratedReply(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    } catch (err) {
      const body = err?.response?.data;
      let msg =
        (typeof body === 'string' && body) ||
        body?.message ||
        body?.error ||
        'Could not generate a reply. Check that the server is running and try again.';
      if (typeof msg !== 'string') msg = 'An error occurred while generating the reply.';
      setError(msg);
      console.error('Error generating reply:', err);
    } finally {
      setLoading(false);
    }
  }, [emailContent, tone]);

  const handleCopy = useCallback(async () => {
    if (!generatedReply) return;
    try {
      await navigator.clipboard.writeText(generatedReply);
      setCopySnackbar(true);
    } catch {
      setError('Could not copy to clipboard.');
    }
  }, [generatedReply]);

  const handleClearAll = useCallback(() => {
    setEmailContent('');
    setTone('');
    setGeneratedReply('');
    setError('');
  }, []);

  const charCount = useMemo(() => emailContent.length, [emailContent]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        className="app-shell"
        sx={{
          minHeight: '100vh',
          py: { xs: 2, sm: 4 },
          px: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="md" sx={{ width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              overflow: 'hidden',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(91, 79, 214, 0.12)',
              boxShadow: '0 4px 24px rgba(45, 35, 120, 0.08), 0 24px 64px rgba(45, 35, 120, 0.12)',
            }}
          >
            <Box
              sx={{
                px: { xs: 2.5, sm: 4 },
                py: { xs: 3, sm: 4 },
                background:
                  'linear-gradient(145deg, rgba(91, 79, 214, 0.07) 0%, rgba(139, 92, 246, 0.05) 100%)',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    flexShrink: 0,
                    boxShadow: '0 8px 20px rgba(91, 79, 214, 0.35)',
                  }}
                  aria-hidden
                >
                  <MailOutlineIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
                    Email Reply Generator
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Paste an incoming message, pick a tone, and get a ready-to-send draft.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2.5, sm: 4 } }} noValidate>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  multiline
                  minRows={6}
                  maxRows={16}
                  label="Original email"
                  placeholder="Paste the email you need to reply to…"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  helperText={`${charCount.toLocaleString()} characters`}
                  inputProps={{ 'aria-label': 'Original email content' }}
                />

                <FormControl fullWidth>
                  <InputLabel id="tone-label">Tone</InputLabel>
                  <Select
                    labelId="tone-label"
                    id="tone"
                    value={tone}
                    label="Tone"
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Default (model choice)</em>
                    </MenuItem>
                    <MenuItem value="professional">Professional</MenuItem>
                    <MenuItem value="friendly">Friendly</MenuItem>
                    <MenuItem value="formal">Formal</MenuItem>
                  </Select>
                </FormControl>

                {error && (
                  <Alert severity="error" onClose={() => setError('')} variant="outlined">
                    {error}
                  </Alert>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!canSubmit}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" aria-hidden />
                      ) : (
                        <SendIcon fontSize="small" />
                      )
                    }
                    aria-busy={loading}
                  >
                    {loading ? 'Generating…' : 'Generate reply'}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={handleClearAll}
                    disabled={loading}
                  >
                    Clear all
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Fade in={Boolean(generatedReply)} timeout={400} unmountOnExit>
              <Box>
                <Divider />
                <Box sx={{ p: { xs: 2.5, sm: 4 }, pt: { xs: 3, sm: 4 } }}>
                  <Stack spacing={2}>
                    <Typography variant="h2" component="h2" sx={{ fontSize: '1.125rem' }}>
                      Generated reply
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={6}
                      maxRows={20}
                      label="Your draft"
                      value={generatedReply}
                      InputProps={{ readOnly: true }}
                      inputProps={{ 'aria-label': 'Generated reply text' }}
                    />
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<CopyIcon />}
                      onClick={handleCopy}
                      sx={{ alignSelf: { sm: 'flex-start' } }}
                    >
                      Copy to clipboard
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Fade>
          </Paper>
        </Container>

        <Snackbar
          open={copySnackbar}
          autoHideDuration={3000}
          onClose={() => setCopySnackbar(false)}
          message="Copied to clipboard"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
