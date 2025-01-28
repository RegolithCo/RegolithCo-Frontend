import * as React from 'react'

import {
  Alert,
  AlertTitle,
  alpha,
  Avatar,
  Container,
  darken,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material'
import { JSONObject, ScVersionEpochEnum, SurveyData, UserProfile } from '@regolithco/common'
import Gradient from 'javascript-color-gradient'
import { fontFamilies } from '../../../theme'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'

export interface SurveyCorpsLeaderBoardProps {
  // Props here
  epoch: ScVersionEpochEnum
  userProfile?: UserProfile
  data?: SurveyData | null
}

export const SurveyCorpsLeaderBoard: React.FC<SurveyCorpsLeaderBoardProps> = ({ userProfile, data, epoch }) => {
  const theme = useTheme()

  const finalData = (data?.data as []) || []
  const gradient = React.useMemo(
    () =>
      new Gradient()
        .setColorGradient(theme.palette.primary.main, theme.palette.secondary.dark, '#222222')
        .setMidpoint(finalData.length < 4 ? 4 : finalData.length) // 100 is the number of colors to generate. Should be enough stops for our ores
        .getColors(),
    [finalData.length]
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
    <Container
      maxWidth="md"
      sx={{
        pt: 4,
      }}
    >
      <Typography
        variant="h4"
        paragraph
        sx={{
          borderBottom: '1px solid white',
        }}
      >
        Survey Corps Leaderboard (epoch {epoch})
      </Typography>

      {data && (
        <List
          sx={{
            margin: 'auto',
            maxWidth: 600,
            // zebra striping
            '& li:nth-of-type(odd)': {
              backgroundColor: theme.palette.background.default,
            },
          }}
        >
          {/* HEADER */}
          <ListItem>
            <ListItemAvatar sx={{ mr: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  fontFamily: fontFamilies.robotoMono,
                  textAlign: 'center',
                }}
              >
                {'#'}
              </Typography>
            </ListItemAvatar>
            <ListItemText
              primary={'Name'}
              primaryTypographyProps={{
                variant: 'h4',
                sx: {
                  fontWeight: 'bold',
                  fontFamily: fontFamilies.robotoMono,
                },
              }}
            />
            <ListItemSecondaryAction>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  fontFamily: fontFamilies.robotoMono,
                }}
              >
                {'Score'}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          {/* LIST */}
          {(data.data as []).map((entry: JSONObject, idx: number) => (
            <ListItem
              key={idx}
              sx={{
                color: 'white',
                backgroundColor: bgColors[idx],
              }}
            >
              <ListItemAvatar sx={{ mr: 3 }}>
                <Avatar
                  sx={{
                    height: 50,
                    width: 50,
                    color: contrastColors[idx],
                    fontSize: '2rem',
                    border: `4px solid ${borderColors[idx]}`,
                    backgroundColor: gradient[idx],
                  }}
                >
                  {idx + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={entry['name']}
                primaryTypographyProps={{
                  variant: 'h4',
                  sx: {
                    fontWeight: 'bold',
                    fontFamily: fontFamilies.robotoMono,
                  },
                }}
              />
              <ListItemSecondaryAction>
                <Typography variant="h5">{MValueFormatter(entry['score'], MValueFormat.number)}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
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
      </Alert>
    </Container>
  )
}
