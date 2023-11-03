import * as React from 'react'
import { useTheme, Box, Typography, alpha } from '@mui/material'
import { ActivityEnum, getActivityName, jsRound, StatsObject } from '@regolithco/common'
import { MayHaveLabel, ResponsivePie } from '@nivo/pie'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'

export interface PieChartProps {
  title: string
  ores?: StatsObject['shipOres'] | StatsObject['vehicleOres'] | StatsObject['salvageOres']
  activityTypes?: StatsObject['workOrderTypes']
  loading: boolean
}
/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const PieChart: React.FC<PieChartProps> = ({ title, ores, activityTypes, loading }) => {
  const theme = useTheme()

  const normalizedData: MayHaveLabel[] = React.useMemo(() => {
    if (loading) return []
    if (!ores && !activityTypes) return []
    if (ores) {
      const total = Object.values(ores).reduce((acc, curr) => acc + curr, 0)
      const normed = Object.entries(ores).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value / total }),
        {} as Record<string, number>
      )
      return Object.entries(ores).map<MayHaveLabel>(([key, value]) => ({
        id: key,
        label: key,
        value: normed[key],
        realValue: value,
      }))
    } else if (activityTypes) {
      const total = Object.values(activityTypes).reduce((acc, curr) => acc + curr, 0)
      const normed = Object.entries(activityTypes).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value / total }),
        {} as Record<string, number>
      )
      return Object.entries(activityTypes).map<MayHaveLabel>(([key, value]) => ({
        id: getActivityName(key as ActivityEnum),
        label: getActivityName(key as ActivityEnum),
        value: normed[key],
        realValue: value,
      }))
    } else return []
  }, [ores])

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.secondary.dark,
          fontWeight: 'bold',
          mb: 1,
          fontFamily: fontFamilies.robotoMono,
          borderBottom: `1px solid ${theme.palette.secondary.dark}`,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsivePie
          data={normalizedData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={1}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          sortByValue={true}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]],
          }}
          theme={{
            textColor: '#eeeeee',
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#eeeeee"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          valueFormat={(value) => `${jsRound(value * 100, 0)}%`}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2]],
          }}
          tooltip={({ datum }) => {
            return (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: alpha(theme.palette.background.paper, 0.6),
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6">{datum.label}</Typography>
                <Typography variant="h6">{`${jsRound(datum.value * 100, 0)}%`}</Typography>
                {ores && (
                  <Typography variant="h6">
                    {MValueFormatter(jsRound((datum.data as any).realValue * 100, 0), MValueFormat.volSCU)}
                  </Typography>
                )}
                {activityTypes && (
                  <Typography variant="h6">
                    {MValueFormatter((datum.data as any).realValue, MValueFormat.number)} Work Orders
                  </Typography>
                )}
              </Box>
            )
          }}
          animate={true}
        />
      </Box>
    </Box>
  )
}
