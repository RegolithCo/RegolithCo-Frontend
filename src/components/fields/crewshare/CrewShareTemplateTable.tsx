import React from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  Theme,
  SxProps,
  Autocomplete,
  TextField,
  createFilterOptions,
} from '@mui/material'
import { CrewShareTemplate, CrewShareTemplateInput, ShareTypeEnum, UserSuggest, validateSCName } from '@regolithco/common'
import { CrewShareTemplateTableRow } from './CrewShareTemplateTableRow'
import { MValue, MValueFormat } from '../MValue'
import { UserListItem } from '../UserListItem'
// import log from 'loglevel'

export interface CrewShareTemplateTableProps {
  onChange: (newShares: CrewShareTemplateInput[]) => void
  onDeleteCrewShare?: (scName: string) => void
  crewShareTemplates: CrewShareTemplate[]
  userSuggest?: UserSuggest
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
  },
})

const filter = createFilterOptions<
  [
    string,
    {
      friend: boolean
      session: boolean
      named: boolean
    }
  ]
>()

export const CrewShareTemplateTable: React.FC<CrewShareTemplateTableProps> = ({
  onChange,
  crewShareTemplates,
  onDeleteCrewShare,
  userSuggest,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const expenses: { name: string; value: number }[] = []

  const sortedCrewshares: [number, CrewShareTemplate][] = (crewShareTemplates || []).map((cs, idx) => [idx, cs])
  const typeOrder = [ShareTypeEnum.Amount, ShareTypeEnum.Percent, ShareTypeEnum.Share]
  sortedCrewshares.sort(([, csa], [, csb]) => typeOrder.indexOf(csa.shareType) - typeOrder.indexOf(csb.shareType))
  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left" padding="none">
              Username
            </TableCell>
            <TableCell align="center" padding="none">
              Type
            </TableCell>
            <TableCell align="right" padding="none">
              Share
            </TableCell>
            <TableCell align="center" padding="none">
              Note
            </TableCell>
            <TableCell align="right" padding="none"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCrewshares.map(([idx, crewShare]) => (
            <CrewShareTemplateTableRow
              key={`crewShare-${idx}`}
              crewShare={crewShare}
              onDelete={() => {
                onDeleteCrewShare && onDeleteCrewShare(crewShare.scName)
              }}
              onChange={(newCrewShare) => {
                onChange(crewShareTemplates.map((cs, i) => (i === idx ? newCrewShare : cs)))
              }}
            />
          ))}
          {expenses.map(({ name, value }, idx) => (
            <TableRow key={`expensesRows-${idx}`}>
              <TableCell component="th" scope="row" colSpan={2}>
                {name}
              </TableCell>
              <TableCell align="right" colSpan={3}>
                <MValue value={value} format={MValueFormat.currency} />
              </TableCell>
              <TableCell align="right">&nbsp;</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Autocomplete
        id="adduser"
        renderOption={(props, [scName, { friend, session, named }]) => (
          <UserListItem
            scName={scName}
            key={`scname-${scName}`}
            props={props}
            session={session}
            named={named}
            friend={friend}
          />
        )}
        clearOnBlur
        blurOnSelect
        getOptionLabel={(option) => {
          if (option === null) return ''
          if (typeof option === 'string') return option
          if (Array.isArray(option) && option[0]) return option[0]
          else return ''
        }}
        getOptionDisabled={(option) => (crewShareTemplates || []).find((cs) => cs.scName === option[0]) !== undefined}
        options={Object.entries(userSuggest || {})}
        sx={{ my: 3 }}
        fullWidth
        freeSolo
        renderInput={(params) => <TextField {...params} label="Add Share User" />}
        filterOptions={(options, params) => {
          const filtered = filter(options, params)
          if (params.inputValue !== '') {
            filtered.push([params.inputValue, { session: false, friend: false, named: false }])
          }
          return filtered
        }}
        onChange={(event, option) => {
          let addName = ''
          if (typeof option === 'string') {
            addName = option
          } else if (Array.isArray(option) && option[0]) {
            addName = option[0]
          }
          if (validateSCName(addName)) {
            onChange([
              ...(crewShareTemplates || []),
              {
                scName: addName,
                shareType: ShareTypeEnum.Share,
                share: 1,
              },
            ])
          }
        }}
      />
    </>
  )
}
