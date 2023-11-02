import { RefObject, useRef } from "react"
import { type Mesh } from "three"



export const UserModel = ({color, ...props} : {color: string}) => {

    const character: RefObject<Mesh> = useRef(null)
return(
    <mesh {...props} ref={character}>
    <boxGeometry />
    <meshNormalMaterial />
  </mesh>
)
}