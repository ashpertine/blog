function ErrorBox({ message}: { message: string}) {
  return <div className="bg-red-600 p-2 rounded-lg max-w-80 overflow-x-auto">
    <span><b>{message}</b></span>
  </div>
}

export default ErrorBox;
