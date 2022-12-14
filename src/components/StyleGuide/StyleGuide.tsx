import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  TabPanel,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Pagination,
  Radio,
  Paper,
  RadioGroup,
  Rating,
  Select,
  Skeleton,
  Slider,
  Typography,
} from '@mui/material'
import React from 'react'
import {
  Bookmark,
  DeleteOutline,
  Fingerprint,
  SendOutlined,
  Favorite,
  FavoriteBorder,
  Mail,
  Menu,
  BookmarkBorder,
} from '@mui/icons-material'

/**
 * This component is used to display the style guide for the application.
 * We never deploy this. We just use it in storybook
 * @returns
 */
export const StyleGuide: React.FC = () => {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <Menu />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              News
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 128,
            height: 128,
          },
        }}
      >
        <Paper elevation={0}>Paper</Paper>
        <Paper>Paper</Paper>
        <Paper elevation={3}>Paper</Paper>
      </Box>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            MUI
          </Link>
          <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/">
            Core
          </Link>
          <Typography color="text.primary">Breadcrumbs</Typography>
        </Breadcrumbs>
        <Pagination count={10} />
      </Box>
      <Box>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
              benevoleent
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adjective
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Box>
      <Box>
        <Alert severity="error">This is an error alert — check it out!</Alert>
        <Alert severity="warning">This is a warning alert — check it out!</Alert>
        <Alert severity="info">This is an info alert — check it out!</Alert>
        <Alert severity="success">This is a success alert — check it out!</Alert>
      </Box>
      <Box>
        <CircularProgress color="secondary" />
        <CircularProgress color="success" />
        <CircularProgress color="inherit" />
        <LinearProgress />
        <LinearProgress variant="determinate" value={65} />
      </Box>
      <Box>
        <Avatar alt="Remy Sharp">
          <Fingerprint />
        </Avatar>
        <Badge badgeContent={4} color="primary">
          <Mail color="action" />
        </Badge>
      </Box>
      <Divider />
      <Box>
        <Chip label="Chip Filled" />
        <Chip label="Chip Outlined" variant="outlined" />
      </Box>
      <Typography variant="h2">Typography:</Typography>
      <Box>
        <Typography variant="h1" component="div">
          Heading 1
        </Typography>
        <Typography variant="h2" component="div">
          Heading 2
        </Typography>
        <Typography variant="h3" component="div">
          Heading 3
        </Typography>
        <Typography variant="h4" component="div">
          Heading 4
        </Typography>
        <Typography variant="h5" component="div">
          Heading 5
        </Typography>
        <Typography variant="h6" component="div">
          Heading 6
        </Typography>
        <Typography variant="subtitle1" component="div">
          Subtitle 1
        </Typography>
        <Typography variant="subtitle2" component="div">
          Subtitle 2
        </Typography>
        <Typography variant="body1" component="div">
          Body 1
        </Typography>
        <Typography variant="body2" component="div">
          Body 2
        </Typography>
        <Typography variant="button" component="div">
          Button
        </Typography>
        <Typography variant="caption" component="div">
          Caption
        </Typography>
        <Typography variant="overline" component="div">
          Overline
        </Typography>
      </Box>
      <Typography variant="h2">Buttons:</Typography>
      <Box>
        <div>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div>
          <Button variant="outlined" size="small">
            Small
          </Button>
          <Button variant="outlined" size="medium">
            Medium
          </Button>
          <Button variant="outlined" size="large">
            Large
          </Button>
        </div>
        <div>
          <Button variant="contained" size="small">
            Small
          </Button>
          <Button variant="contained" size="medium">
            Medium
          </Button>
          <Button variant="contained" size="large">
            Large
          </Button>
        </div>
      </Box>
      <Box>
        <Button variant="outlined" startIcon={<DeleteOutline />}>
          Delete
        </Button>
        <Button variant="contained" endIcon={<SendOutlined />}>
          Send
        </Button>
      </Box>
      <Box>
        <IconButton aria-label="delete" size="small">
          <DeleteOutline fontSize="inherit" />
        </IconButton>
        <IconButton aria-label="delete" size="small">
          <DeleteOutline fontSize="small" />
        </IconButton>
        <IconButton aria-label="delete" size="large">
          <DeleteOutline />
        </IconButton>
        <IconButton aria-label="delete" size="large">
          <DeleteOutline fontSize="inherit" />
        </IconButton>
      </Box>
      <Box>
        <IconButton aria-label="fingerprint" color="secondary">
          <Fingerprint />
        </IconButton>
        <IconButton aria-label="fingerprint" color="success">
          <Fingerprint />
        </IconButton>
      </Box>
      <Box>
        <Checkbox {...label} defaultChecked />
        <Checkbox {...label} />
        <Checkbox {...label} disabled />
        <Checkbox {...label} disabled checked />
        <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
        <Checkbox {...label} icon={<BookmarkBorder />} checkedIcon={<Bookmark />} />
      </Box>
      <Box>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Radio Group</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Option B"
            name="radio-buttons-group"
          >
            <FormControlLabel value="Option A" control={<Radio />} label="Option A" />
            <FormControlLabel value="Option B" control={<Radio />} label="Option B" />
            <FormControlLabel value="Option C" control={<Radio />} label="Option C" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box>
        <Rating
          name="simple-controlled"
          value={2}
          max={10}
          precision={0.2}
          icon={<Favorite />}
          emptyIcon={<FavoriteBorder />}
        />
      </Box>
      <Box>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={10} label="Age">
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Slider defaultValue={30} step={10} marks min={10} max={110} disabled />
      </Box>
      <Box>
        {/* For variant="text", adjust the height via font-size */}
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation="wave" />

        {/* For other variants, adjust the size with `width` and `height` */}
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
        <Skeleton variant="rectangular" width={210} height={60} animation="pulse" />
        <Skeleton variant="rounded" width={210} height={60} animation="wave" />
      </Box>
      <Box>
        <Tabs value={'one'} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example">
          <Tab value="one" label="Item One" />
          <Tab value="two" label="Item Two" />
          <Tab value="three" label="Item Three" />
        </Tabs>
      </Box>
    </Container>
  )
}
