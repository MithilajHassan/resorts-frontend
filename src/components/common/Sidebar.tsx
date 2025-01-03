import { createContext, useContext, useState } from "react";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu"

interface SidebarProp {
    children: JSX.Element[];
    adminName: string;
    adminEmail: string;
}
interface ISidebarContext {
    expanded: boolean
}

const SidebarContext = createContext<ISidebarContext | null>(null)

export default function Sidebar({ children, adminName, adminEmail }: SidebarProp) {
    const [expanded, setExpanded] = useState(true)

    return (
        <aside className={`pt-16 transition-all ${expanded ? 'w-64 ' : 'w-16'} h-screen`}>
            <nav className="h-full flex flex-col bg-white border-r shadow-sm fixed">

                <div className="p-4 pb-2 flex justify-between items-center">
                    <img src="/images/Logo.png" className={`overflow-hidden transition-all ${expanded ? "w-8" : "w-0"}`} alt="" />
                    <button onClick={() => setExpanded(curr => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                        {expanded ? <LuChevronFirst /> : <LuChevronLast />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>

                <div className="flex border-t p-3 sticky bottom-0 bg-white">
                    <img src="/images/Logo.png" className="w-10 h-10 rounded-md" />
                    <div className={`
                        flex justify-between items-ceneter
                        overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
                    `}>
                        <div className="leading-4">
                            <h4 className="font-semibold overflow-hidden">{adminName}</h4>
                            <span className="text-xs text-gray-600">{adminEmail}</span>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
    )
}

interface SidebarItems {
    icon: JSX.Element;
    text: string;
    active?: boolean;
    alert?: string;
}

export function SidebarItem({ icon, text, active, alert }: SidebarItems) {
    const context = useContext(SidebarContext)

    if (!context) {
        return null
    }

    const { expanded } = context
    return (
        <li className={`
            relative flex items-center py-2 px-3 my-1
            font-medium rounded-md cursor-pointer
            transition-colors group
            ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                : "hover:bg-indigo-50 text-balck"
            }
        `}>
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />}
            {!expanded && (<div className={`
                absolute left-full rounded-md px-2 py-1 ml-6
                bg-indigo-100 text-indigo-800 text-sm
                invisible opacit-20 -translate-x-3 transition-all
                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}>{text}</div>)}
        </li>
    )
}