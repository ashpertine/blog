function ErrorBox({ message, details }: { message: string, details: string[] | null }) {
  return <div className="bg-red-600 p-2 rounded-lg max-w-80 overflow-x-auto">
    <span><b>{message}</b></span>
    {details ? <ul>
      {details.map((detail, index) =>
        <li key={`error-item-${index}`}>{detail}</li>
      )}
    </ul> : null}
  </div>
}

export default ErrorBox;
