// import React from 'react'
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   FormControlLabel,
//   FormGroup,
//   Switch,
//   Tooltip,
//   Typography,
//   useTheme,
// } from '@mui/material'
// import { ActivityEnum, ShipMiningOrder, WorkOrderStateEnum } from '@regolithco/common'
// import { WorkOrderCalcProps } from '../WorkOrderCalc'
// import { fontFamilies } from '../../../../theme'
// import { ExpandMore, Help } from '@mui/icons-material'
// import { ReferenceTables } from './ReferenceTables'
// import { WorkOrderFailModal } from '../../../modals/WorkOrderFailModal'

// export type DetailsCardProps = WorkOrderCalcProps

// export const DetailsCard: React.FC<DetailsCardProps> = ({
//   workOrder,
//   onChange,
//   isCalculator,
//   failWorkOrder,
//   isEditing,
//   templateJob,
//   sx,
// }) => {
//   const theme = useTheme()
//   const [isFailModalOpen, setIsFailModalOpen] = React.useState(false)
//   const shipOrder = workOrder as ShipMiningOrder

//   // Convenience checked functions
//   const isRefinedLocked = (templateJob?.lockedFields || [])?.includes('isRefined')

//   return (
//     <Card sx={sx}>
//       <CardHeader
//         sx={{
//           flex: '0 0',
//           padding: 1.5,
//           color: theme.palette.secondary.contrastText,
//           backgroundColor: theme.palette.secondary.light,
//         }}
//         title={
//           <Box
//             sx={{
//               display: 'flex',
//               fontFamily: fontFamilies.robotoMono,
//               fontWeight: 'bold',
//               fontSize: {
//                 xs: '0.8rem',
//                 md: '0.9rem',
//                 lg: '1rem',
//               },
//               lineHeight: 1,
//             }}
//           >
//             Settings
//           </Box>
//         }
//       />
//       <CardContent
//         sx={{ flex: '1 1', overflowX: 'hidden', overflowY: { md: 'scroll', lg: isCalculator ? 'visible' : 'scroll' } }}
//       >
//         <FormGroup>
//           {isEditing && !isCalculator && (
//             <Tooltip
//               placement="right"
//               title={
//                 <>
//                   <Typography variant="body1" gutterBottom>
//                     Set this job as failed to indicate you won't be able to pay your crew.
//                   </Typography>
//                 </>
//               }
//             >
//               <>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={Boolean(workOrder.state === WorkOrderStateEnum.Failed)}
//                       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//                         if (event.target.checked) {
//                           setIsFailModalOpen(true)
//                         } else {
//                           // Un-fail please
//                           failWorkOrder && failWorkOrder()
//                         }
//                       }}
//                     />
//                   }
//                   label="Work order failed"
//                 />
//                 {workOrder.failReason && (
//                   <Box>
//                     <Typography variant="overline" sx={{ mt: 1, color: theme.palette.error.main }}>
//                       Fail Reason:
//                     </Typography>
//                     <Typography color="error">{workOrder.failReason}</Typography>
//                   </Box>
//                 )}
//               </>
//             </Tooltip>
//           )}
//         </FormGroup>
//         {/* Helpful tips and tricks */}
//         {isEditing && (
//           <Accordion sx={{ mt: 6 }} disableGutters>
//             <AccordionSummary color="info" expandIcon={<ExpandMore color="inherit" />}>
//               <Help sx={{ mr: 2 }} color="inherit" /> Help
//             </AccordionSummary>
//             <AccordionDetails>
//               <Typography variant="caption" component="ol">
//                 {workOrder.orderType === ActivityEnum.ShipMining && (
//                   <>
//                     {shipOrder.isRefined ? (
//                       <>
//                         <li>Select your refinery station and refining method using the dropdowns.</li>
//                         <li>Select the ore(s) you are selling to create rows.</li>
//                         <li>
//                           Click the <strong>QTY</strong> or <strong>Yield</strong> fields to edit the values.
//                         </li>
//                         <li>
//                           Click "START" to set the start time for the job or you can choose it manually if this job has
//                           already been started.
//                         </li>
//                       </>
//                     ) : (
//                       <>
//                         <li>
//                           Select the ore(s) you are <strong>refining</strong> to create rows.
//                         </li>
//                         <li>
//                           Click the <strong>QTY</strong> field to edit the values.
//                         </li>
//                       </>
//                     )}
//                     <li>TAB or ENTER automatically moves to the next row.</li>
//                   </>
//                 )}
//                 {workOrder.orderType === ActivityEnum.VehicleMining && (
//                   <>
//                     <li>Select the ROC ore(s) you are selling to create rows.</li>
//                     <li>
//                       Click the <strong>QTY</strong> field to edit the values.
//                     </li>
//                     <li>TAB or ENTER automatically moves to the next row.</li>
//                     <li>
//                       <strong>Amounts are in cSCU</strong> meaning that the number you enter in the <strong>QTY</strong>{' '}
//                       field corresponds to the number of rock shards/gems.
//                     </li>
//                   </>
//                 )}
//                 {workOrder.orderType === ActivityEnum.Salvage && (
//                   <>
//                     <li>
//                       Click the <strong>QTY</strong> field to edit the values.
//                     </li>
//                     <li>
//                       <strong>Amounts are in SCU</strong> so the <strong>QTY</strong> field should be the # of boxes you
//                       sell.
//                     </li>
//                   </>
//                 )}
//                 {workOrder.orderType === ActivityEnum.Other && (
//                   <>
//                     <li>Click to type in the "Amount to share" box to get started</li>
//                   </>
//                 )}
//                 <li>Add users using their star citizen usernames</li>
//               </Typography>
//             </AccordionDetails>
//           </Accordion>
//         )}
//         <ReferenceTables activity={workOrder.orderType} />
//       </CardContent>
//       <WorkOrderFailModal
//         open={isFailModalOpen}
//         onClose={() => setIsFailModalOpen(false)}
//         onChoose={(reason: string) => {
//           failWorkOrder && failWorkOrder(reason)
//         }}
//       />
//     </Card>
//   )
// }
