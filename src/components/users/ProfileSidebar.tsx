import { ReactElement } from "react";

interface Props {
  children: ReactElement[]
}

export default function ProfileSidebar({ children }: Props) {
  return (
    <div className="border rounded-md w-full">
      <ul className="list-none">
        {children}
        
      </ul>
    </div>
  )
}
