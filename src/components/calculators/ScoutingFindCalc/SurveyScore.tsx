import * as React from 'react'
import { Typography, Stack, useTheme, Button, Link, Dialog, Box } from '@mui/material'
import { ScoutingFindStateEnum, SurveyFindScore } from '@regolithco/common'
import { SurveyCorpsIcon } from '../../../icons'

// Object.values(ScoutingFindStateEnum)
export const SCOUTING_FIND_STATE_NAMES: ScoutingFindStateEnum[] = [
  ScoutingFindStateEnum.Discovered,
  ScoutingFindStateEnum.ReadyForWorkers,
  ScoutingFindStateEnum.Working,
  ScoutingFindStateEnum.Depleted,
  ScoutingFindStateEnum.Abandonned,
]

export interface SurveyScoreProps {
  scoreObj: SurveyFindScore
}

/**
 * @param param0
 * @returns
 */
export const SurveyScore: React.FC<SurveyScoreProps> = ({ scoreObj }) => {
  const theme = useTheme()
  const [explainOpen, setExplainOpen] = React.useState(false)
  const percentSuccess = (scoreObj.score / scoreObj.possible) * 100
  let color = 'success'
  if (scoreObj.errors.length > 0 || percentSuccess < 50) color = 'error'
  else if (scoreObj.warnings.length > 0 || percentSuccess < 100) color = 'warning'

  return (
    <Stack direction="row" spacing={1} sx={{ mx: 2 }} alignItems={'center'}>
      <SurveyCorpsIcon />
      <Typography
        variant="caption"
        component="div"
        sx={{
          color: theme.palette[color].main,
        }}
      >
        Survey Score: {scoreObj.score}/{scoreObj.possible}{' '}
        <Link
          onClick={() => {
            setExplainOpen(true)
          }}
        >
          Explain?
        </Link>
      </Typography>
      <Dialog open={explainOpen} onClose={() => setExplainOpen(false)}>
        <Stack direction="column" spacing={2} sx={{ p: 2 }}>
          <Typography variant="h6">Survey Score Explanation</Typography>
          <Typography variant="body1" component="div">
            The survey score is a measure of how well you have completed a survey. It is calculated by adding points for
            each successful completion and subtracting points for each error or warning. The possible score is the
            maximum number of points that can be earned for a survey.
            <ul>
              <li>There are large bonuses for completing a scan.</li>
              <li>Red Errors need to be fixed or your score is 0.</li>
            </ul>
          </Typography>
          {scoreObj.errors.length > 0 && (
            <Box>
              <Typography variant="h6" color="error">
                Errors
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  {scoreObj.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </Typography>
            </Box>
          )}
          {scoreObj.warnings.length > 0 && (
            <Box>
              <Typography variant="h6" color="orange">
                Warnings
              </Typography>
              <Typography variant="body1" color="orange" component="div">
                <ul>
                  {scoreObj.warnings.map((warn, idx) => (
                    <li key={idx}>{warn}</li>
                  ))}
                </ul>
              </Typography>
            </Box>
          )}
          <Button onClick={() => setExplainOpen(false)}>Close</Button>
        </Stack>
      </Dialog>
    </Stack>
  )
}
