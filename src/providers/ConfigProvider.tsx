import { createContext, ReactNode, useContext } from "react";

type ContextType = {

}

const ConfigContext = createContext<ContextType | null>(null);

const useConfigContext = () => {
    const context = useContext(ConfigContext);
    if (context === null) {
        throw new Error("useConfigContext must be used within a ConfigProvider")
    }

    return context;
}

const ConfigProvider = ({ children }: { children: ReactNode }) => {

    return (
        <ConfigContext.Provider value={{}}>
            {children}
        </ConfigContext.Provider>
    )
}

export { useConfigContext, ConfigProvider };    