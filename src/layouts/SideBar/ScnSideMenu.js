import React, { Fragment, useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSideBarContext } from "../../context/SideBarContextProvider.js";
import { Context } from "../../context/Context.js";

const ScnSideMenu = () => {
    const { user } = useContext(Context)
    const { modules } = useSideBarContext()
    const [mainn, setMainn] = useState([]);
    const [mainmenu, setMainMenu] = useState([]);

    useEffect(() => {
        getUserModule()
    }, [])

    const getUserModule = async () => {
        console.log("user modules", modules)
    
        let userModules = modules

        userModules && userModules?.map((mod) => {
        mod.active = false;
        mod.title = mod.module_name;
        delete mod.module_name;
        mod.icon = mod.icon;
        mod.type = "sub"

        // Process and sort submodules by rank
        mod.SubModules = mod.SubModules
            .map((sub) => {
                sub.active = false;
                sub.type = "link"
                sub.title = sub.submodule_name;
                delete sub.submodule_name;
                sub.path = sub.route;
                delete sub.route;
                return sub;
            })
            .sort((a, b) => a.rank - b.rank); // Sort by rank ascending

        mod.children = mod.SubModules;
        delete mod.SubModules;
        return mod;
    });

        var menu = {
            menutitle: "HOME",
            Items: [
                {
                    path: `dashboard`,
                    icon: "home",
                    type: "link",
                    active: true,
                    title: "Dashboard",
                },
            ],
        };

        var menu2 = {
            menutitle: "LINKS",
            Items: userModules
        };

        var menu3 = {
            menutitle: "ROLE SETTINGS",
            Items: [
                {
                    icon: "package",
                    type: "sub",
                    active: false,
                    title: "Role Management",
                    children: [
                        {
                            path: `${process.env.PUBLIC_URL}/role`,
                            title: "Create Role",
                            type: "link",
                        },
                        {
                            path: `${process.env.PUBLIC_URL}/module-list`,
                            title: "Create Module",
                            type: "link",
                        },
                        {
                            path: `${process.env.PUBLIC_URL}/submodule-list`,
                            title: "Create Submodule",
                            type: "link",
                        },
                        {
                            path: `${process.env.PUBLIC_URL}/assign-module-to-role`,
                            title: "Assign Module to role",
                            type: "link",
                        },

                    ],
                }
            ]

        };


        var MENUITEMS = [menu, menu2];
        var newMenu = [...MENUITEMS, menu3]
        // console.log("men", MENUITEMS);
        // console.log("men 2", newMenu);
        // return MENUITEMS;
        if(user.user.role_id === 1){
            setMainn(newMenu)
            setMainMenu(newMenu)
        }else{
            setMainn(MENUITEMS)
            setMainMenu(MENUITEMS)
        }

        const currentUrl = window.location.pathname.slice(0, -1);
        console.log("cur url", currentUrl)

        mainn.map((items) => {
            items.Items.filter((Items) => {
                if (Items.path === currentUrl) setNavActive(Items);
                if (!Items.children) return false;
                Items.children.filter((subItems) => {
                    if (subItems.path === currentUrl) setNavActive(subItems);
                    if (!subItems.children) return false;
                    subItems.children.filter((subSubItems) => {
                        if (subSubItems.path === currentUrl) {
                            setNavActive(subSubItems);
                            return true;
                        } else {
                            return false;
                        }
                    });
                    return subItems;
                });
                return Items;
            });
            return items;
        });
    }

    const setNavActive = (item) => {
        console.log("menuItems", mainn)
        console.log("item", item)
        //toggle active, check if item received is in mainn array (true then active true else active false)
        mainn?.map((menuItems) => {
            menuItems.Items.filter((Items) => {
                if (Items !== item) {
                    Items.active = false;
                }

                if (Items.children && Items.children.includes(item)) {
                    Items.active = true;
                }
                // if (Items.children) {
                //     Items.children.filter((submenuItems) => {
                //         if (submenuItems.children && submenuItems.children.includes(item)) {
                //             Items.active = true;
                //             submenuItems.active = true;
                //             return true;
                //         } else {
                //             return false;
                //         }
                //     });
                // }
                return Items;
            });
            return menuItems;
        });
        item.active = !item.active;
        setMainMenu({ mainmenu: mainn });
    };

    const toggletNavActive = (item) => {
        let mainn = mainmenu;
        // console.log(mainn);
        if (window.innerWidth <= 991) {
            if (item.type === "sub") {


            }
        }
        if (!item.active) {

            mainn.map((a) => {
                a.Items.filter((Items) => {
                    if (a.Items.includes(item)) Items.active = false;
                    if (!Items.children) return false;
                    Items.children.forEach((b) => {
                        if (Items.children.includes(item)) {
                            b.active = false;
                        }
                        if (!b.children) return false;
                        b.children.forEach((c) => {
                            if (b.children.includes(item)) {
                                c.active = false;
                            }
                        });
                    });
                    return Items;
                });
                return a;
            });
        }
        item.active = !item.active;
        setMainMenu({ mainmenu: mainn });
    };

    return (
        <>
            <ul className="side-menu" id="sidebar-main">
                {mainn?.map((Item, i) => (
                    <Fragment key={i}>
                        <li className="sub-category">
                            <h3>{Item.menutitle}</h3>
                        </li>
                        {Item.Items.map((menuItem, i) => (
                            <li
                                className={`slide ${menuItem.active ? "is-expanded" : ""
                                    }`}
                                key={i}
                            >
                                {menuItem.type === "link" ? (
                                    <NavLink
                                        to={menuItem.path + "/"}
                                        className={`side-menu__item ${menuItem.active ? "active" : ""
                                            }`}
                                        onClick={() => {
                                            toggletNavActive(menuItem);
                                            setNavActive(menuItem);

                                        }}
                                    >
                                        <i
                                            className={`side-menu__icon fe fe-${menuItem.icon}`}
                                        ></i>
                                        <span className="side-menu__label">
                                            {menuItem.title}
                                        </span>
                                       
                                    </NavLink>
                                ) : (
                                    ""
                                )}

                                {menuItem.type === "sub" ? (
                                    
                                    <NavLink
                                        to={menuItem.path + "/"}
                                        className={`side-menu__item ${menuItem.active ? "active" : ""
                                            }`}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setNavActive(menuItem); //menuItem is the module that is clicked
                                        }}
                                    >
                                        <i
                                            className={`side-menu__icon fe fe-${menuItem.icon}`}
                                        ></i>
                                        <span className="side-menu__label">
                                            {menuItem.title}
                                        </span>
                                       
                                        <i
                                            className={`${menuItem.background} fa angle fa-angle-right `}
                                        ></i>
                                    </NavLink>
                                ) : (
                                    ""
                                )}
                                {menuItem.children ? (
                                    <ul
                                        className="slide-menu"
                                        style={
                                            menuItem.active
                                                ? {
                                                    opacity: 1,
                                                    transition: "opacity 500ms ease-in",
                                                    display: "block",
                                                }
                                                : { display: "none" }
                                        }
                                    >
                                        {menuItem.children.map((childrenItem, index) => {
                                            return (
                                                <li key={index}>
                                                    {childrenItem.type === "sub" ? (
                                                        <a
                                                            href="javascript"
                                                            className="sub-side-menu__item"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                toggletNavActive(childrenItem);
                                                            }}
                                                        >
                                                            <span className="sub-side-menu__label">
                                                                {childrenItem.title}
                                                            </span>
                                                            {childrenItem.active ? (
                                                                <i className="sub-angle  fa fa-angle-down"></i>
                                                            ) : (
                                                                <i className="sub-angle fa fa-angle-right"></i>
                                                            )}
                                                        </a>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {childrenItem.type === "link" ? (
                                                        <NavLink
                                                            to={childrenItem.path + "/"}
                                                            className="slide-item"
                                                            onClick={() => {
                                                                toggletNavActive(childrenItem)
                                                            }}
                                                        >
                                                            {childrenItem.title}
                                                        </NavLink>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {childrenItem.children ? (
                                                        <ul
                                                            className="sub-slide-menu"
                                                            style={
                                                                childrenItem.active
                                                                    ? { display: "block" }
                                                                    : { display: "none" }
                                                            }
                                                        >
                                                            {childrenItem.children.map(
                                                                (childrenSubItem, key) => (
                                                                    <li key={key}>
                                                                        {childrenSubItem.type === "link" ? (
                                                                            <NavLink
                                                                                to={childrenSubItem.path + "/"}
                                                                                className={`${"sub-slide-item"}`}
                                                                                onClick={() =>
                                                                                    toggletNavActive(
                                                                                        childrenSubItem
                                                                                    )
                                                                                }
                                                                            >
                                                                                {childrenSubItem.title}
                                                                            </NavLink>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        ""
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    ""
                                )}
                            </li>
                        ))}
                    </Fragment>
                ))}
            </ul>
        </>
    )
}

export default ScnSideMenu