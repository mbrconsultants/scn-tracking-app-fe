import React, {createContext, useContext, useState} from 'react'

const SideBarContext = createContext({
    modules: JSON.parse(localStorage.getItem("modules")),
})

export const useSideBarContext = () => useContext(SideBarContext)