import { Folder, Gift, GraduationCap, Home, Mail, Moon } from "lucide-react"

const Icon = ({children} : {children: React.ReactNode}) => {
  return (
    <div className="rounded transition-all duration-200 p-1 hover:bg-white">
      {children}
    </div>
  )
}

export default function Navigation() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="backdrop-blur-2xl shadow-md rounded-full flex px-4 py-1 gap-x-4">
        <Icon><Home /></Icon>
        <br className="text-black"/>
        <Icon><Folder /></Icon>
        <Icon><Gift /></Icon>
        <Icon><GraduationCap /></Icon>
        <Icon><Mail /></Icon>
        <Icon><Moon /></Icon>
      </div>
    </div>
  )
}