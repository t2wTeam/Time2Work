import { Grid } from "@mui/material"



interface TimeFragment {
    fragments: boolean[]
}

export const TimeFragment = (props: TimeFragment) => {
    let { fragments } = props;
    return (
        <Grid container width="100%" height="100%">
            {fragments.map((availibility, i) => (
                <Grid
                    item
                    key={i}
                    // xs={3}
                    sx={{
                        bgcolor: availibility ? "#4F7942" : "transparent",
                        border: availibility ? 0 : '0.25px dotted #DDDDDD', // Apply border only when availability is false
                        borderBottom: '1px solid black', // Solid border at the bottom for all items
                        // borderStyle: "dotted",
                        // borderColor: "#DDDDDD", // Border color
                    }}
                    width="100%"
                    height="100%"
                />
            ))}
        </Grid>
    );
};


export const TimeFragmentVertical = (props: TimeFragment) =>{
    let { fragments } = props
    return (
        <Grid container width="100%" height="100%">
            {
                fragments.map((availibility, i) => (
                    <Grid item key={i} xs={12}  width="100%"  height="25%"
                    sx={{ 
                        bgcolor: availibility ? "#4F7942" : "transparent",
                        border: availibility ? 0 : 0.25, // Apply border only when availibility is false
                        // borderTop: i === 2 ?  "0.5px dashed": "none",
                        borderColor: "#DDDDDD",
                        borderStyle: "dotted",
                    }}/>
                ))
            }
        </Grid>
    )
}

