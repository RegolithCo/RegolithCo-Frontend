import React from 'react'
import {
  Autocomplete,
  Box,
  createFilterOptions,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Tooltip,
  useTheme,
} from '@mui/material'
import { InnactiveUser, UserSuggest, validateSCName, VerifiedUserLookup } from '@regolithco/common'
import { Cancel, PersonAdd } from '@mui/icons-material'
import { UserListItem } from './UserListItem'

export interface MentionedUserListProps {
  verifiedUsers: VerifiedUserLookup
  mentionedUsers: InnactiveUser[]
  myFriends: string[]
  useAutocomplete?: boolean
  addToList?: (friendName: string) => void
  addFriend?: (friendName: string) => void
  removeFriend?: (friendName: string) => void
  removeFromList?: (friendName: string) => void
}

const filter = createFilterOptions<
  [
    string,
    {
      friend: boolean
      session: boolean
      named: boolean
      crew: boolean
    }
  ]
>()

export const MentionedUserList: React.FC<MentionedUserListProps> = ({
  verifiedUsers,
  mentionedUsers,
  myFriends,
  useAutocomplete,
  addToList,
  addFriend,
  removeFriend,
  removeFromList,
}) => {
  const theme = useTheme()
  const [newFriend, setNewFriend] = React.useState<string>('')
  const [keyCounter, setKeyCounter] = React.useState(0)

  const userSuggest: UserSuggest = myFriends.reduce(
    (acc, friendName) => ({
      ...acc,
      [friendName]: {
        friend: true,
        session: false,
        named: false,
        crew: false,
      },
    }),
    {} as UserSuggest
  )

  return (
    <Box>
      <List
        dense
        sx={{
          height: '100%',
          maxHeight: 400,
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        {(mentionedUsers || []).map((mentionedUser, idx) => {
          const isVerified = Boolean(verifiedUsers[mentionedUser.scName])
          return (
            <ListItem
              key={`userlist-${idx}`}
              sx={{ background: idx % 2 === 1 ? theme.palette.background.default : 'transparent' }}
            >
              {/* <ListItemAvatar>
                <Badge badgeContent={isVerified ? <Verified color="success" /> : null} overlap="circular">
                  <Avatar>
                    <Person />
                  </Avatar>
                </Badge>
              </ListItemAvatar> */}
              <ListItemText primary={mentionedUser.scName} />
              <ListItemSecondaryAction>
                {addFriend && myFriends.indexOf(mentionedUser.scName) < 0 && (
                  <Tooltip title="Add this user as a friend">
                    <IconButton onClick={() => addFriend(mentionedUser.scName)}>
                      <PersonAdd />
                    </IconButton>
                  </Tooltip>
                )}
                {((removeFriend && myFriends.indexOf(mentionedUser.scName) > -1) || removeFromList) && (
                  <IconButton
                    onClick={() => {
                      removeFriend && removeFriend(mentionedUser.scName)
                      removeFromList && removeFromList(mentionedUser.scName)
                    }}
                  >
                    <Cancel />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
      {addToList && !useAutocomplete && (
        <TextField
          fullWidth
          variant="outlined"
          value={newFriend}
          placeholder={'Enter a username...'}
          size="small"
          disabled={!addToList}
          sx={{}}
          onChange={(e) => {
            setNewFriend(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && validateSCName(newFriend)) {
              addToList && addToList(newFriend)
              setNewFriend('')
            }
          }}
        />
      )}
      {addToList && useAutocomplete && (
        <Autocomplete
          id="adduser"
          key={`uniquekey-${keyCounter}`}
          renderOption={(props, [scName, { friend, session, named }]) => (
            <UserListItem
              scName={scName}
              key={`scname-${scName}`}
              session={session}
              named={named}
              friend={friend}
              props={props}
            />
          )}
          clearOnBlur
          blurOnSelect
          fullWidth
          freeSolo
          getOptionLabel={(option) => {
            if (option === null) return ''
            if (typeof option === 'string') return option
            if (Array.isArray(option) && option[0]) return option[0]
            else return ''
          }}
          getOptionDisabled={(option) =>
            (mentionedUsers || []).find(({ scName }) => scName.toLowerCase() === option[0].toLowerCase()) !== undefined
          }
          options={Object.entries(userSuggest || {})}
          sx={{ mb: 3 }}
          renderInput={(params) => <TextField {...params} label="Add a name" />}
          filterOptions={(options, params) => {
            const filtered = filter(options, params)
            if (params.inputValue !== '') {
              filtered.push([params.inputValue, { session: false, friend: false, named: false, crew: false }])
            }
            return filtered
          }}
          onChange={(event, option) => {
            const addName = typeof option === 'string' ? option : Array.isArray(option) ? option[0] : ''
            if (
              validateSCName(addName) &&
              !(mentionedUsers || []).find(({ scName }) => scName.toLowerCase() === addName.toLowerCase())
            ) {
              setKeyCounter(keyCounter + 1)
              addToList(addName)
            }
          }}
        />
      )}
    </Box>
  )
}
