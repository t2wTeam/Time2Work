import { Grid } from "@mui/material"



interface TimeFragment {
    fragments: boolean[]
}

export const TimeFragment = (props: TimeFragment) => {
    let { fragments } = props
    return (
        <Grid container width="100%" height="100%">
            {
                fragments.map((availibility, i) => (
                    <Grid item key={i} xs={3} sx={{ bgcolor: availibility ? "#4F7942" : "#F2F3F5", border:0.5, borderStyle:"dotted" }} width="25%" height="100%"/>
                ))
            }
        </Grid>
    )
}


export const TimeFragmentVertical = (props: TimeFragment) =>{
    let { fragments } = props
    return (
        <Grid container width="100%" height="100%">
            {
                fragments.map((availibility, i) => (
                    <Grid item key={i} xs={12}  width="100%"  height="25%"  
                    sx={{ 
                        bgcolor: availibility ? "#4F7942" : "#F2F3F5",
                        borderTop: i === 2 ?  "1px dashed": "none",
                    }}/>
                ))
            }
        </Grid>
    )
}

