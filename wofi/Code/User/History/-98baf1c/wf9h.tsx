import { GithubactionsPlain, GithubOriginal, GithubOriginalWordmark, LinkedinOriginal, LinkedinPlain } from "devicons-react";
import { BsGithub } from "react-icons/bs";
import { DiGithubAlt } from "react-icons/di";
import { FaGithub } from "react-icons/fa";
import { MdAttachEmail, MdEmail, MdOutlineEmail } from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";

const SIZE = 60

export default function ItemsContact() {
    return (
        <div className="flex">
            <FaGithub color="white" size={SIZE}/>
            <LinkedinPlain color="white" size={SIZE}/>
            <MdOutlineEmail color="white" size={SIZE+10}/> 
        </div>
    )
}