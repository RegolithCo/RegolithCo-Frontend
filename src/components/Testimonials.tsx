import React from 'react'
import { Box, Card, CardContent, Typography, Avatar, Stack, useTheme } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'

const testimonials = [
  {
    name: 'Commander Shepard',
    role: 'Spectre',
    avatar: 'https://i.pravatar.cc/150?u=1',
    text: 'Regolith Co. is easily my third-favorite mining tool for Star Citizen!',
    rating: 5,
  },
  {
    name: 'Ellen Ripley',
    role: 'Warrant Officer',
    avatar: 'https://i.pravatar.cc/150?u=2',
    text: 'Of all the apps I have tried, Regolith is definitely one of them.',
    rating: 3,
  },
  {
    name: 'Samus Aran',
    role: 'Bounty Hunter',
    avatar: 'https://i.pravatar.cc/150?u=4',
    text: 'This finally solves the problem of Star Citizen being too much like fun and not enough like work. Thanks Regolith!',
    rating: 4,
  },
  {
    name: 'Han Solo',
    role: 'Smuggler',
    avatar: 'https://i.pravatar.cc/150?u=5',
    text: 'Imagine if you could live in the Star Wars universe... as an accountant!',
    rating: 2,
  },
  {
    name: 'Isaac Clarke',
    role: 'Engineer',
    avatar: 'https://i.pravatar.cc/150?u=3',
    text: 'I laughed, I cried. I loved it more than the CATS movie!',
    rating: 1,
  },
]

const Testimonials: React.FC = () => {
  const theme = useTheme()

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ px: 1 }}>
        What People Are Saying
      </Typography>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pb: 2,
          px: 1,
          // Hide scrollbar for cleaner look but keep functionality
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.background.paper,
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: '4px',
          },
        }}
      >
        {testimonials.map((testimonial, idx) => (
          <Card
            key={`testimonial-${idx}`}
            elevation={4}
            sx={{
              minWidth: 300,
              maxWidth: 300,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} color={i < testimonial.rating ? 'warning' : 'disabled'} fontSize="small" />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                "{testimonial.text}"
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={testimonial.avatar} alt={testimonial.name} />
                <Box>
                  <Typography variant="subtitle2">{testimonial.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default Testimonials
