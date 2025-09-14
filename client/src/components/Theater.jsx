
import { useCallback, useEffect, useState } from 'react'
import './Theater.css';


export default function Theater() {
  const [areas, setAreas] = useState([])
   
  const xmlToJson = useCallback( (node) => {
        const json = {}
        
        let children = [...node.children]
       // console.log(node.nodeName)
       // console.log(node.innerHTML)
         
        if(!children.length) return node.innerHTML
        
         for(let child of children) {
           const hassSiblings = children.filter(c => c.nodeName === child.nodeName).length > 1 
          
           if(hassSiblings){
            if(json[child.nodeName] === undefined){
               json [child.nodeName] = [xmlToJson(child)] 
            
           }else{
          json [child.nodeName].push (xmlToJson(child)) 
           }
           }else{
            json[child.nodeName] = xmlToJson(child)
        }    
  
}
return json
    },[])
  




  
    const parseXML = useCallback((xml) => { 
         const parser = new DOMParser()
         const xmlDoc = parser.parseFromString(xml,'application/xml')
            return xmlToJson(xmlDoc)
        },[xmlToJson])

    
  
  
    /*const getFinnkinoTheaters = (xml)=> {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xml,'application/xml')
        
        const root = xmlDoc.children
        //console.log(root)
        const theaters = root[0].children
        const tempAreas = []
        
        for(let i = 0;i < theaters.length; i++) {
           // console.log(theaters[i].children[0].innerHTML)
            // console.log(theaters[i].children[0].innerHTML)
            tempAreas.push(
                {"id": theaters[i].children[0].innerHTML,
                 "name": theaters[i].children[1].innerHTML 
                    
                }
            )
            
        }
        
        setAreas(tempAreas)
    
    }*/


    useEffect(() => { 

        fetch ('https://www.finnkino.fi/xml/TheatreAreas/')
        .then(response => response.text())
        .then(xml =>{
            //console.log(xml)
          //  getFinnkinoTheaters(xml)
             const json = parseXML(xml)
            
            
             console.log(json.TheatreAreas.TheatreArea)
            setAreas (json.TheatreAreas.TheatreArea)
           
            })
        .catch(error => {
            
            
            console.log(error)
        })
    }, [parseXML] )



    return (
   <div className="theaterContainer">
   Theater

<select>
{
areas.map(area => (
    <option key={area.ID}>{area.Name}</option>
))
}
</select>

    </div>
  );
}
