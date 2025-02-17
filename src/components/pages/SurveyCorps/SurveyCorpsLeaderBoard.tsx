import * as React from 'react'

import {
  Alert,
  AlertTitle,
  alpha,
  Avatar,
  Container,
  darken,
  Link,
  Stack,
  Tab,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { DiscordGuild, JSONObject, ScVersionEpochEnum, SurveyData, UserProfile } from '@regolithco/common'
import Gradient from 'javascript-color-gradient'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import { Diversity3, Person } from '@mui/icons-material'

export interface SurveyCorpsLeaderBoardProps {
  // Props here
  epoch: ScVersionEpochEnum
  userProfile?: UserProfile
  userBoard?: SurveyData | null
  guildBoard?: SurveyData | null
}

export const SurveyCorpsLeaderBoard: React.FC<SurveyCorpsLeaderBoardProps> = ({
  userProfile,
  userBoard,
  guildBoard,
  epoch,
}) => {
  const theme = useTheme()
  const [tabValue, setTabValue] = React.useState<'USER' | 'ORG'>('USER')
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  const h4Size = isSmall ? 'h6' : 'h4'
  return (
    <Container
      maxWidth="md"
      sx={{
        pt: 4,
        overflow: 'hidden',
        overflowY: 'auto',
        height: '100%',
      }}
    >
      <Typography
        variant={h4Size}
        paragraph
        sx={{
          borderBottom: '1px solid white',
        }}
      >
        Survey Corps Leaderboard
      </Typography>
      <Typography variant={'overline'} paragraph sx={{}}>
        epoch {epoch}
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        variant={isSmall ? 'fullWidth' : 'standard'}
        sx={{
          mb: 4,
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <Tab label="By User" value={'USER'} icon={<Person />} iconPosition="start" />
        <Tab label="By Org." value={'ORG'} icon={<Diversity3 />} iconPosition="start" />
      </Tabs>

      {/* USER LEADERBOARD */}
      {tabValue === 'USER' && <UserBoard data={(userBoard?.data as []) || []} />}

      {/* ORG LEADERBOARD */}
      {tabValue === 'ORG' && <GuildBoard data={(guildBoard?.data as []) || []} />}

      <Alert severity="error" sx={{ my: 4 }}>
        <AlertTitle>Scores subject to change</AlertTitle>
        <Typography variant="body1" paragraph>
          Scoring equations are still being developed so expect these numbers to jump around a bit in the next few
          weeks. Ranks shouldn't change much since an update to the scoring system will apply to all data simultaneously
          but this is tricky so the Regolith staff thanks you for your patience while we figure this out.
        </Typography>
      </Alert>

      <Alert severity="info" sx={{ my: 4 }}>
        <AlertTitle>Leaderboard</AlertTitle>
        <Typography variant="body1" paragraph>
          When you scan rocks for the Survey Corps you get a score based on completeness, accuracy and data need.
        </Typography>
        <Typography variant="body1" paragraph>
          The leaderboard updates every hour (ish)
        </Typography>
        <Typography variant="body1" paragraph>
          The names here are chosen by the user and may or may not be their real name. Users are free to remain
          anonymous as well if they want.
        </Typography>
        <Typography variant="body1" paragraph>
          Your leaderboard name and Org. allegiance can be set on your <Link href="/profile/survey">profile</Link>.
        </Typography>
      </Alert>
    </Container>
  )
}

const GuildBoard: React.FC<{ data: JSONObject[] }> = ({ data }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  const finalUserData = (data as []) || []
  const gradient = React.useMemo(
    () =>
      new Gradient()
        .setColorGradient(theme.palette.primary.main, theme.palette.secondary.dark, '#222222')
        .setMidpoint(finalUserData.length < 4 ? 4 : finalUserData.length) // 100 is the number of colors to generate. Should be enough stops for our ores
        .getColors(),
    [finalUserData.length]
  )
  const contrastColors = gradient.map((color) => {
    return theme.palette.getContrastText(color)
  })
  const bgColors = gradient.map((color) => {
    return alpha(color, 0.5)
  })
  const borderColors = gradient.map((color) => {
    return darken(color, 0.5)
  })

  return (
    <TableContainer>
      <Table
        sx={{
          '& *, & .MuiTypography-root': {
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          },
          margin: 'auto',
          maxWidth: 800,
          // zebra striping
          '& li:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {/* HEADER */}
        <TableHead>
          <TableRow
            sx={{
              '& *': {
                background: 'black',
              },
            }}
          >
            <TableCell>#</TableCell>
            <TableCell>Org.</TableCell>
            <TableCell align="right">Collective Score</TableCell>
          </TableRow>
        </TableHead>

        {/* LIST */}
        {(data as []).map((entry: JSONObject, idx: number) => {
          return (
            <TableRow
              key={idx}
              sx={{
                color: 'white',
                backgroundColor: bgColors[idx],
              }}
            >
              <TableCell>
                <Avatar
                  sx={{
                    height: 30,
                    width: 30,
                    color: contrastColors[idx],
                    fontSize: '1rem',
                    border: `2px solid ${borderColors[idx]}`,
                    backgroundColor: gradient[idx],
                  }}
                >
                  {idx + 1}
                </Avatar>
              </TableCell>
              <TableCell>
                {entry['guild'] ? (
                  <EntryGuild guild={entry['guild']} />
                ) : (
                  <em
                    style={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    None
                  </em>
                )}
              </TableCell>
              <TableCell align="right">
                <Typography>{MValueFormatter(entry['score'], MValueFormat.number)}</Typography>
              </TableCell>
            </TableRow>
          )
        })}
      </Table>
    </TableContainer>
  )
}

const UserBoard: React.FC<{ data: JSONObject[] }> = ({ data }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  const finalUserData = (data as []) || []
  const gradient = React.useMemo(
    () =>
      new Gradient()
        .setColorGradient(theme.palette.primary.main, theme.palette.secondary.dark, '#222222')
        .setMidpoint(finalUserData.length < 4 ? 4 : finalUserData.length) // 100 is the number of colors to generate. Should be enough stops for our ores
        .getColors(),
    [finalUserData.length]
  )
  const contrastColors = gradient.map((color) => {
    return theme.palette.getContrastText(color)
  })
  const bgColors = gradient.map((color) => {
    return alpha(color, 0.5)
  })
  const borderColors = gradient.map((color) => {
    return darken(color, 0.5)
  })

  return (
    <TableContainer>
      <Table
        sx={{
          '& *, & .MuiTypography-root': {
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          },
          margin: 'auto',
          maxWidth: 800,
          // zebra striping
          '& li:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {/* HEADER */}
        <TableHead>
          <TableRow
            sx={{
              '& *': {
                background: 'black',
              },
            }}
          >
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Org. Allegiance</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>

        {/* LIST */}
        {(data as []).map((entry: JSONObject, idx: number) => (
          <TableRow
            key={idx}
            sx={{
              color: 'white',
              backgroundColor: bgColors[idx],
            }}
          >
            <TableCell>
              <Avatar
                sx={{
                  height: 30,
                  width: 30,
                  color: contrastColors[idx],
                  fontSize: '1rem',
                  border: `2px solid ${borderColors[idx]}`,
                  backgroundColor: gradient[idx],
                }}
              >
                {idx + 1}
              </Avatar>
            </TableCell>
            <TableCell>{entry['name']}</TableCell>
            <TableCell>
              {entry['guild'] ? (
                <EntryGuild guild={entry['guild']} />
              ) : (
                <em
                  style={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  None
                </em>
              )}
            </TableCell>
            <TableCell align="right">{MValueFormatter(entry['score'], MValueFormat.number)}</TableCell>
          </TableRow>
        ))}
      </Table>
    </TableContainer>
  )
}

const EntryGuild: React.FC<{ guild: DiscordGuild }> = ({ guild }) => {
  return (
    <Tooltip title={guild.name}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', overflow: 'hidden' }}>
        {guild.iconUrl && <Avatar src={guild.iconUrl} alt={guild.name} />}
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {guild.name}
        </Typography>
      </Stack>
    </Tooltip>
  )
}
