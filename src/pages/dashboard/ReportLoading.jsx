import Skeleton from "react-loading-skeleton";

export default function ReportLoading() {
  return (
    <div className="flex flex-col items-start w-full">
        <Skeleton height={40} width={400} className="mb-10" />
        <div className="flex gap-4">
            {
                [1,2,3].map((_, index) => (
                    <Skeleton key={index} height={300} width={"30vw"} className="mb-4" />
                ))
            }
        </div>
      
    </div>
  )
}
