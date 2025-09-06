export default function Loader(){


return(
<div>
<div style={{display:'flex', justifyContent:'right',marginRight: "20px"}} className="mb-9" >
<img 
  src={require("../../assets/images/loader.svg").default}
  className="loader-img mb-4"
  alt="Loader"
 
/>
</div>
<div className="mb-2" style={{textAlign:"center", marginTop:"20px", paddingTop:"20px"}}>Loading...</div>
</div>
)
}