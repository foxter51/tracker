export default function ErrorCard({ message }) {
    return (
        <div className="card w-50 mx-auto">
            <div className="card-header d-flex justify-content-center">
                <div className="h2">Error</div>
            </div>
            <div className="card-body d-flex justify-content-center">
                <div className="h4">
                    { message }
                </div>
            </div>
        </div>
    )
}