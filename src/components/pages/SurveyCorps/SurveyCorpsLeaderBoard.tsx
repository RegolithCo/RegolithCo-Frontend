import * as React from 'react'

import {
  Avatar,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material'
import { JSONObject, SurveyData, UserProfile } from '@regolithco/common'

export interface SurveyCorpsLeaderBoardProps {
  // Props here
  userProfile?: UserProfile
  data?: SurveyData | null
}

export const SurveyCorpsLeaderBoard: React.FC<SurveyCorpsLeaderBoardProps> = ({ userProfile, data }) => {
  const theme = useTheme()
  console.log('marzipan2', data)
  return (
    <Container
      maxWidth="md"
      sx={{
        pt: 4,
      }}
    >
      <Typography variant="h5" paragraph>
        Scanning Leaderboard
      </Typography>

      {data && (
        <List
          sx={{
            maxWidth: 400,
            // zebra striping
            '& li:nth-of-type(odd)': {
              backgroundColor: theme.palette.background.default,
            },
          }}
        >
          <ListItem>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText primary={'Name'} />
            <ListItemSecondaryAction>
              <Typography variant="h6">{'Score'}</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          {(data.data as []).map((entry: JSONObject, idx: number) => (
            <ListItem key={idx}>
              <ListItemAvatar>
                <Avatar>{idx + 1}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={entry['name']} />
              <ListItemSecondaryAction>
                <Typography variant="h6">{entry['score']}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  )
}
