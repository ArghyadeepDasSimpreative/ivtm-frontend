import { useParams } from "react-router-dom"
import { useEffect } from "react"

const Questionairre = () => {
  const { type } = useParams()

  useEffect(() => {
    console.log("Selected Standard Type:", type)
  }, [type])

  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold">Questionnaire for: {type.toUpperCase()}</h1>
    </div>
  )
}

export default Questionairre
