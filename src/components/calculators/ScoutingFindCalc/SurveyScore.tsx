import * as React from 'react'
import { Typography, Stack, useTheme, Button, Link, Dialog, Box, DialogTitle, DialogActions } from '@mui/material'
import { ScoutingFindStateEnum, SurveyFindScore } from '@regolithco/common'
import { SurveyCorpsIcon } from '../../../icons'
import { HelpOutline } from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'

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
  includeInSurvey: boolean
}

/**
 * @param param0
 * @returns
 */
export const SurveyScore: React.FC<SurveyScoreProps> = ({ scoreObj, includeInSurvey }) => {
  const theme = useTheme()
  const [explainOpen, setExplainOpen] = React.useState(false)
  const percentSuccess = (scoreObj.score / scoreObj.possible) * 100
  let color = 'success'
  if (scoreObj.errors.length > 0 || percentSuccess < 50) color = 'error'
  else if (scoreObj.warnings.length > 0 || percentSuccess < 100) color = 'warning'

  if (!includeInSurvey) {
    return (
      <Button
        fullWidth
        onClick={() => setExplainOpen(true)}
        size="small"
        disabled
        sx={{
          color: theme.palette.text.primary,
        }}
      >
        Not In Survey
      </Button>
    )
  }

  return (
    <>
      <Button
        fullWidth
        onClick={() => setExplainOpen(true)}
        endIcon={<HelpOutline />}
        size="small"
        sx={{
          color: theme.palette[color].main,
        }}
      >
        Area Bonus: {MValueFormatter(scoreObj.areaBonus, MValueFormat.number, 2)}
        <br />
        Final Score: {MValueFormatter(scoreObj.score, MValueFormat.number, 0)}/
        {MValueFormatter(scoreObj.possible, MValueFormat.number, 0)}
      </Button>
      <Dialog
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 10,
            boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
            background: theme.palette.background.default,
            border: `10px solid ${theme.palette.primary.main}`,
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <SurveyCorpsIcon sx={{ fontSize: 50 }} />
            <Typography variant="h5">
              Survey Corps Score: {MValueFormatter(scoreObj.score, MValueFormat.number, 0)}/
              {MValueFormatter(scoreObj.possible, MValueFormat.number, 0)}
            </Typography>
          </Stack>
        </DialogTitle>
        <Stack direction="column" spacing={2} sx={{ px: 4 }}>
          <Typography variant="body1" component="div" color="text.secondary">
            <p>
              This score is a measure of how well you have completed a survey. It is calculated by adding points for
              each complete scan and subtracting points for each error or warning. These points will go toward your
              leaderboard score.
            </p>
            <p>The bonus for this area is at {MValueFormatter(scoreObj.areaBonus, MValueFormat.number, 2)}</p>
            <p>
              In this case there are <strong>{MValueFormatter(scoreObj.possible, MValueFormat.number, 0)}</strong>{' '}
              possible points of which you have earned{' '}
              <strong>{MValueFormatter(scoreObj.score, MValueFormat.number, 0)}</strong>.
            </p>
          </Typography>
          {scoreObj.errors.length > 0 && (
            <Box>
              <Typography variant="h6" color="error">
                Errors for this cluster:
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{
                  color: theme.palette.error.main,
                }}
              >
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
                Warnings for this cluster:
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
          <Typography variant="body2" component="div" color="text.secondary">
            <p>Tips for maximizing your score:</p>
            <ul>
              <li>Make sure to accurately scan all rocks in a cluster.</li>
              <li>Make sure to scan all ores in every rock.</li>
              <li>Address any of the warnings or errors above.</li>
            </ul>
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            <Link href="/survey/about" target="_blank" rel="noreferrer">
              Learn more about the Survey Corps
            </Link>
          </Typography>
          <DialogActions>
            <Stack justifyContent={'center'} direction="row" spacing={1} sx={{ width: '100%' }}>
              <Button
                color="primary"
                variant="text"
                onClick={() => setExplainOpen(false)}
                sx={{ background: theme.palette.background.paper }}
              >
                {'Ok'}
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  )
}
