import { AvatarGroup, Box, FormControl, Skeleton } from '@mui/material'


const GroupSettingSkeleton = () => {
  return (
    <FormControl
    component="form"
    variant="standard"
    sx={{ width: "100%", maxWidth: 280 }}  
  >
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Skeleton
        variant="circular"
        width={140}
        height={140}
        sx={{ marginTop: 4, marginBottom: 4 }}
      />
    </Box>

    <Skeleton 
      variant="rectangular"
      width="100%"
      height={56}
      sx={{ 
        mb:4,
        borderRadius: 1
      }}
    />

    

    <Skeleton 
      variant="rectangular"
      width="100%"
      height={200}
      sx={{ 
        marginBottom: 4,
        borderRadius: 1
      }}
    />

    <Skeleton 
      variant="text" 
      width={80} 
      sx={{ marginBottom: 1 }}
    />
    
    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
      <AvatarGroup max={5}>
        {Array(5).fill(0).map((_, index) => (
          <Skeleton 
            key={index}
            variant="circular"
            width={40}
            height={40}
          />
        ))}
      </AvatarGroup>
    </Box>
  </FormControl>
  )
}

export default GroupSettingSkeleton