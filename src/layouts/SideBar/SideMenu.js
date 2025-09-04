
import { menuUnstyledClasses } from "@mui/base";
import React, { useState, useContext, useEffect} from "react";
import { Link, useParams }  from "react-router-dom";
import { Context } from "../../context/Context";
import endpoint from "../../context/endpoint";


export const getMenuItem = () => {
 return endpoint.get(`dynamic-sidebar`).then((response) => {
  console.log(response)
  const allData = response.data;
  let module = allData.modules;
           
  module?.map((mod)=>{
    mod.active = false;
    mod.title = mod.moduleName;
    delete mod.moduleName;
     mod.icon= "package";
     mod.type="sub"
    
      mod?.submodule?.map((sub)=>{
      
      sub.active = false;
      sub.type = "link"
      sub.title = sub.submoduleName;
        delete sub.submoduleName;
        sub.path=`${process.env.PUBLIC_URL}/${sub.route}`;
        delete sub.route;
          return sub;
      })

    mod.children=mod.submodule;
    delete mod.submodule
    return mod;

  });

  var menu ={
    menutitle: "Elements",
    Items:module
  };

 var menu2= {
    menutitle: "MAIN",
      Items: [
        {
          path: `${process.env.PUBLIC_URL}/dashboard`,
          icon: "home",
          type: "link",
          active: true,
          title: "Overview",
        },
      ],
  }

           
var MENUITEMS=[menu2,menu];
//  console.log(module) ;
// console.log(MENUITEMS);
return MENUITEMS;
})
.catch(err => {
  console.log(err);
});
    
}

    export const hrMenu = [
      {
        // menutitle: "MAIN",
        Items: [
          {
            path: `${process.env.PUBLIC_URL}/dashboard`,
            icon: "home",
            type: "link",
            active: true,
            title: "Dashboard",
          }
        ],
      },
         
      {
        // menutitle: "Elements",
        Items: [
          {
            title: "Self Service",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/userprofile`,
                type: "link",
                title: "My profile",
              },
            ],
          },
          {
            title: "Registry",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/create-user`,
                type: "link",
                title: "New Staff",
              },
              {
                path: `${process.env.PUBLIC_URL}/users`,
                type: "link",
                title: "Staff Documentation",
              },
              {
                path: `${process.env.PUBLIC_URL}/staff-file`,
                type: "link",
                title: "Staff Profile",
              },
              {
                path: `${process.env.PUBLIC_URL}/emolument`,
                type: "link",
                title: "Emolument Record",
              },
              {
                path: `${process.env.PUBLIC_URL}/emolument-details`,
                type: "link",
                title: "Emolument Details",
              },
            ],
          },
          
          {
            title: "Department",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/Departments`,
                type: "link",
                title: "Departments",
              },
              {
                path: `${process.env.PUBLIC_URL}/units`,
                type: "link",
                title: "Units",
              },
              {
                path: `${process.env.PUBLIC_URL}/department-units`,
                type: "link",
                title: "Department Units",
              },
  
            ],
          },
          {
            title: "File",
            icon: "file",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/file-category-setup`,
                title: "File Category Setup",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/file-subcategory-setup`,
                title: "File Sub-Category Setup",
                type: "link",
              },
              // {
              //   path: `${process.env.PUBLIC_URL}/volume-setup`,
              //   title: "Volume/Limit Setup",
              //   type: "link",
              // },
              {
                path: `${process.env.PUBLIC_URL}/all-file`,
                title: "All Files",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/create-file`,
                title: "Create File",
                type: "link",
              },
            
              {
                path: `${process.env.PUBLIC_URL}/upload-document`,
                title: "Upload Document",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/file-jackets`,
                title: "File Jackets",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/sent-files`,
                title: "Sent Files",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/receive-send-file`,
                title: "Receive/Move File",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/track-file`,
                title: "Track File",
                type: "link",
              },
            
            ],
          },
          {
            title: "Leave",
            icon: "home",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/leave-type`,
                title: "Leave Type",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/leave-num-days`,
                title: "Leave No. of Days",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/leave-roaster`,
                title: "Leave Roaster",
                type: "link",
              },
              
              {
                path: `${process.env.PUBLIC_URL}/leave-application`,
                title: "Leave Application",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/leave-resumption`,
                title: "Leave Resumption",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/Holidays`,
                title: "Holidays",
                type: "link",
              },
            
            ],
          },
          {
            title: "Discipline",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/disciplinary-setup`,
                title: "Disciplinary Setup",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/report-offence`,
                title: "Report Offence",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/create-discipline`,
                title: "Discipline a Staff",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/disciplined`,
                title: "Disciplined Staff",
                type: "link",
              },
            
            ],
          },
          {
            title: "Training",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/training`,
                title: "Training",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/training-type`,
                title: "Training Type",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/create-training`,
                title: "Create Training",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/select-training-candidate`,
                title: "Select Candidate",
                type: "link",
              },
            
            ],
          },
          {
            title: "Nominal Roll",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/distribution-by-zone`,
                title: "Distribution By Zone",
                type: "link",
              },
              {
                path: `${process.env.PUBLIC_URL}/distribution-by-origin`,
                title: "Distribution By State of Origin",
                type: "link",
              },
             
            ],
          },
          {
            title: "Promotion",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              
             
            ],
          },
          {
            title: "Record and Variation",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              
             
            ],
          },
          {
            title: "Gazetting",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/gazette`,
                title: "Gazette Staff",
                type: "link",
              },
             
            ],
          },
          {
            title: "NHF",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/nhf`,
                title: "Staff NHF",
                type: "link",
              },
             
            ],
          },
          {
            title: "NHIS",
            icon: "package",
            type: "sub",
            active: false,
            children: [
              {
                path: `${process.env.PUBLIC_URL}/nhis`,
                title: "Staff NHIS",
                type: "link",
              },
             
            ],
          },
      
        ]
      }
  ];

