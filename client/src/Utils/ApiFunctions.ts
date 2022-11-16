import axios from "axios"
import { Example } from "./ApiInterfaces"

//TODO: add data types
export const loginHandler = async (props: Example) => {
    let r = await axios.get(`/api/v1/login`)
    return r.data
}