import { Grid } from "@mui/material"



interface TimeFragment {
    fragments: boolean[]
}

let TimeFragment = (props: TimeFragment) => {
    let { fragments } = props
    return (
        <Grid container width="100%" height="100%">
            {
                fragments.map((availibility, i) => (
                    <Grid item key={i} xs={3} sx={{ bgcolor: availibility ? "darkgreen" : "darkred" }} width="25%" height="100%" />
                ))
            }
        </Grid>
    )
}

export default TimeFragment