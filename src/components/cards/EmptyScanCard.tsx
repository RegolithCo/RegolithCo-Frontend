import * as React from 'react'
import { Card, useTheme, SxProps, Theme, IconButton, Box, Tooltip, Typography, alpha } from '@mui/material'
import { Add, Cancel, SvgIconComponent } from '@mui/icons-material'

export interface EmptyScanCardProps {
  onClick?: () => void
  onDelete?: () => void
  deleteDisabled?: boolean
  Icon: SvgIconComponent
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  card: {
    opacity: 0.4,
    cursor: 'pointer',
    border: `4px dashed ${theme.palette.primary.main}`,
    width: '100%',
    height: '100%',
    minHeight: '170px',
    position: 'relative',
    overflow: 'hidden',
  },
  waterMark: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 120,
    color: '#f0f0f012',
    zIndex: -1,
  },
  deleteButton: {
    position: 'absolute',
    top: '12%',
    right: '-4%',
    transform: 'translate(-50%, -50%)',
    color: theme.palette.primary.light,
    cursor: 'pointer',
    // backgroundColor: theme.palette.primary.main,
    opacity: 0.6,
    zIndex: 2,
  },
  deleteButtonDisabled: {
    position: 'absolute',
    top: '12%',
    right: '-4%',
    transform: 'translate(-50%, -50%)',
    color: alpha(theme.palette.primary.light, 0.2),
    cursor: 'not-allowed',
    // backgroundColor: theme.palette.primary.main,
    opacity: 0.6,
    zIndex: 2,
  },
  iconButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    opacity: 0.5,
  },
})

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const EmptyScanCard: React.FC<EmptyScanCardProps> = ({ onClick, Icon, onDelete, deleteDisabled }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title={deleteDisabled ? 'Cannot delete last scan' : 'Delete this scan'} placement="top">
        <Cancel
          sx={deleteDisabled ? styles.deleteButtonDisabled : styles.deleteButton}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete && onDelete()
          }}
        />
      </Tooltip>
      <Tooltip title="Add to this cluster" placement="top">
        <Card sx={styles.card} onClick={onClick}>
          <Icon sx={styles.waterMark} />
          <IconButton sx={styles.iconButton}>
            <Add />
          </IconButton>
          <Typography variant="caption" sx={{ textAlign: 'center', mt: 2 }} component={'div'}>
            Click to Add Scan
          </Typography>
        </Card>
      </Tooltip>
    </Box>
  )
}
