import { LinkedinPlain } from "devicons-react";
import { FaGithub } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const SIZE = 60

export default function ItemsContact() {
    return (
        <div className="flex items-center gap-x-4 mt-4">
            <FaGithub color="white" size={SIZE} className="hover:scale-50"/>
            <LinkedinPlain color="white" size={SIZE}/>
            <MdOutlineEmail color="white" size={SIZE+10}/> 
        </div>
    )
}