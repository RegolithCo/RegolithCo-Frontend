import * as React from 'react'
import { useTheme, Box, Typography, alpha, darken } from '@mui/material'
import { jsRound, RegolithStatsSummary } from '@regolithco/common'
import { MayHaveLabel, ResponsivePie } from '@nivo/pie'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'

export interface OrePieChartProps {
  title: string
  groupThreshold?: number
  nameFinder?: (id: unknown) => string
  ores?:
    | RegolithStatsSummary['shipOres']
    | RegolithStatsSummary['vehicleOres']
    | RegolithStatsSummary['salvageOres']
    | RegolithStatsSummary['refineryMethod']
  activityTypes?:
    | RegolithStatsSummary['workOrderTypes']
    | RegolithStatsSummary['refineryMethod']
    | RegolithStatsSummary['refineries']
  loading: boolean
}
/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const OrePieChart: React.FC<OrePieChartProps> = ({ title, ores, activityTypes, loading, groupThreshold }) => {
  const theme = useTheme()
  const finalGroupThreshold = groupThreshold || 0
  const [hasData, setHasData] = React.useState(true)

  const normalizedData: MayHaveLabel[] = React.useMemo(() => {
    if (loading) return []
    if (!ores && !activityTypes) return []

    const processData = (data: Record<string, number>) => {
      const total = Object.values(data).reduce((acc, curr) => acc + curr, 0)
      const normed = Object.entries(data).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value / total }),
        {} as Record<string, number>
      )

      const aboveThreshold = Object.entries(normed)
        .filter(([_, value]) => value >= finalGroupThreshold)
        .map<MayHaveLabel>(([key, _]) => ({
          id: key,
          label: key,
          value: normed[key],
          realValue: data[key],
        }))

      const belowThresholdTotal = Object.entries(normed)
        .filter(([_, value]) => value < finalGroupThreshold)
        .reduce((acc, [_, value]) => acc + value, 0)

      if (belowThresholdTotal) {
        aboveThreshold.push({
          id: 'Other',
          label: 'Other',
          value: belowThresholdTotal,
          realValue: belowThresholdTotal * total,
        } as MayHaveLabel)
      }
      if (aboveThreshold.length === 0) {
        setHasData(false)
        return [
          {
            id: 'No Data',
            label: 'No Data',
            value: 1,
            realValue: 0,
          },
        ]
      } else {
        setHasData(true)
      }

      return aboveThreshold
    }

    if (ores) {
      return processData(ores)
    } else if (activityTypes) {
      return processData(activityTypes)
    } else {
      return []
    }
  }, [ores, activityTypes])

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
        {hasData ? (
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
            theme={
              {
                // textColor: '#eeeeee',
              }
            }
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
                      {MValueFormatter(
                        jsRound((datum.data as unknown as { realValue: number }).realValue, 0),
                        MValueFormat.volSCU,
                        0
                      )}
                    </Typography>
                  )}
                  {activityTypes && (
                    <Typography variant="h6">
                      {MValueFormatter((datum.data as unknown as { realValue: number }).realValue, MValueFormat.number)}{' '}
                      Work Orders
                    </Typography>
                  )}
                </Box>
              )
            }}
            animate={true}
          />
        ) : (
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: darken(theme.palette.text.secondary, 0.5),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            No Data
          </Typography>
        )}
      </Box>
    </Box>
  )
}
