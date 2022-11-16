import { IconButton, Tooltip} from "@mui/material"

interface TooltipProps{
    detail: string
    icon: JSX.Element
}


const HelpTooltip = (props: TooltipProps) => {

    let {detail, icon} = props

    return (
        <Tooltip title={detail} leaveDelay={100}>
            <IconButton>
                {icon}
            </IconButton>
        </Tooltip>
    )
}

export default HelpTooltip